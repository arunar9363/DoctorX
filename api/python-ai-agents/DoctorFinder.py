import os
import httpx
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

GOOGLE_PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
GOOGLE_MAPS_API_KEY = os.getenv("Maps_API_KEY", "")

FACILITY_TYPE_MAP = {
    "hospital": "hospital",
    "pharmacy": "pharmacy",
    "doctor": "doctor",
    "emergency": "hospital",
    "clinic": "doctor",
}

RADIUS_MAP = {
    "hospital": 5000,
    "pharmacy": 3000,
    "doctor": 5000,
    "emergency": 5000,
    "clinic": 5000,
}


def _extract_open_status(facility: Dict[str, Any]) -> Optional[bool]:
    """Safely extract open_now status from Google Places opening_hours."""
    opening_hours = facility.get("opening_hours")
    if opening_hours and isinstance(opening_hours, dict):
        return opening_hours.get("open_now")
    return None


def _parse_facility(facility: Dict[str, Any]) -> Dict[str, Any]:
    """
    Filter and clean a single Google Places API result into
    the DoctorXCare standard response shape.
    """
    geometry = facility.get("geometry", {})
    location = geometry.get("location", {})

    return {
        "id": facility.get("place_id", ""),
        "name": facility.get("name", "Unknown Facility"),
        "vicinity": facility.get("vicinity", "Address not available"),
        "rating": facility.get("rating"),
        "user_ratings_total": facility.get("user_ratings_total", 0),
        "geometry": {
            "lat": location.get("lat"),
            "lng": location.get("lng"),
        },
        "open_now": _extract_open_status(facility),
        "photo_reference": _extract_photo_reference(facility),
        "types": facility.get("types", []),
    }


def _extract_photo_reference(facility: Dict[str, Any]) -> Optional[str]:
    """Extract first photo reference if available."""
    photos = facility.get("photos", [])
    if photos and len(photos) > 0:
        return photos[0].get("photo_reference")
    return None


async def get_nearby_facilities(
    latitude: float,
    longitude: float,
    facility_type: str = "hospital",
    radius: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """
    Fetch nearby medical facilities using Google Places Nearby Search API.

    Args:
        latitude:      User's current latitude
        longitude:     User's current longitude
        facility_type: One of 'hospital', 'pharmacy', 'doctor', 'emergency', 'clinic'
        radius:        Search radius in meters (defaults per facility type)

    Returns:
        Cleaned list of facility dicts in DoctorXCare format.

    Raises:
        ValueError:   If API key is missing or facility_type is unsupported.
        RuntimeError: If Google Places API returns an error status.
    """
    if not GOOGLE_MAPS_API_KEY:
        raise ValueError(
            "Maps_API_KEY environment variable is not set. "
            "Please add it to your .env file."
        )

    normalized_type = facility_type.lower().strip()
    if normalized_type not in FACILITY_TYPE_MAP:
        raise ValueError(
            f"Unsupported facility_type '{facility_type}'. "
            f"Allowed values: {list(FACILITY_TYPE_MAP.keys())}"
        )

    places_type = FACILITY_TYPE_MAP[normalized_type]
    search_radius = radius or RADIUS_MAP.get(normalized_type, 5000)

    params = {
        "location": f"{latitude},{longitude}",
        "radius": search_radius,
        "type": places_type,
        "key": GOOGLE_MAPS_API_KEY,
    }

    # Add keyword refinement for emergency / clinic sub-types
    if normalized_type == "emergency":
        params["keyword"] = "emergency hospital"
    elif normalized_type == "clinic":
        params["keyword"] = "clinic specialist"

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(GOOGLE_PLACES_API_URL, params=params)
            response.raise_for_status()
        except httpx.TimeoutException:
            raise RuntimeError(
                "Google Places API request timed out. Please try again."
            )
        except httpx.HTTPStatusError as e:
            raise RuntimeError(
                f"Google Places API returned HTTP {e.response.status_code}: {e.response.text}"
            )
        except httpx.RequestError as e:
            raise RuntimeError(
                f"Network error while contacting Google Places API: {str(e)}"
            )

    data = response.json()
    api_status = data.get("status", "UNKNOWN")

    if api_status == "REQUEST_DENIED":
        raise RuntimeError(
            "Google Places API request was denied. "
            "Check that your Maps_API_KEY is valid and has 'Places API' enabled."
        )
    elif api_status == "OVER_QUERY_LIMIT":
        raise RuntimeError(
            "Google Places API quota exceeded. "
            "Please check your billing and quota settings in Google Cloud Console."
        )
    elif api_status not in ("OK", "ZERO_RESULTS"):
        error_msg = data.get("error_message", "No additional details provided.")
        raise RuntimeError(
            f"Google Places API error: {api_status}. {error_msg}"
        )

    raw_results: List[Dict[str, Any]] = data.get("results", [])

    # Parse + filter each facility into the clean DoctorXCare shape
    cleaned_facilities = [_parse_facility(facility) for facility in raw_results]

    # Sort by rating descending (None ratings go last)
    cleaned_facilities.sort(
        key=lambda f: (f["rating"] is None, -(f["rating"] or 0))
    )

    return cleaned_facilities


async def get_place_details(place_id: str) -> Dict[str, Any]:
    """
    Fetch detailed information for a single place using Google Places Details API.
    Useful for phone numbers, website, full address, and reviews.

    Args:
        place_id: Google Places place_id string

    Returns:
        Dict with detailed place information.
    """
    if not GOOGLE_MAPS_API_KEY:
        raise ValueError("Maps_API_KEY environment variable is not set.")

    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": (
            "name,formatted_address,formatted_phone_number,"
            "website,rating,opening_hours,geometry,photos,reviews"
        ),
        "key": GOOGLE_MAPS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(details_url, params=params)
            response.raise_for_status()
        except (httpx.TimeoutException, httpx.RequestError) as e:
            raise RuntimeError(f"Failed to fetch place details: {str(e)}")

    data = response.json()
    if data.get("status") != "OK":
        raise RuntimeError(
            f"Place Details API error: {data.get('status')} — "
            f"{data.get('error_message', '')}"
        )

    result = data.get("result", {})
    location = result.get("geometry", {}).get("location", {})

    return {
        "id": place_id,
        "name": result.get("name"),
        "formatted_address": result.get("formatted_address"),
        "phone": result.get("formatted_phone_number"),
        "website": result.get("website"),
        "rating": result.get("rating"),
        "geometry": {"lat": location.get("lat"), "lng": location.get("lng")},
        "opening_hours": result.get("opening_hours", {}).get("weekday_text", []),
        "open_now": (
            result.get("opening_hours", {}).get("open_now")
            if result.get("opening_hours")
            else None
        ),
    }