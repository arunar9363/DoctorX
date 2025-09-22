// hooks/useWHOApi.js
// React hook for WHO API integration

import { useState, useEffect, useCallback, useRef } from 'react';
import { whoApiService } from '../services/whoApiService';

export const useWHOApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const monitoringRef = useRef(null);

  /**
   * Generic API call wrapper
   */
  const apiCall = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching WHO data';
      setError(errorMessage);
      console.error('WHO API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch WHO news and updates
   */
  const fetchNews = useCallback(async (options = {}) => {
    return apiCall(whoApiService.fetchNews.bind(whoApiService), options);
  }, [apiCall]);

  /**
   * Search WHO database
   */
  const searchWHO = useCallback(async (query, options = {}) => {
    return apiCall(whoApiService.searchWHO.bind(whoApiService), query, options);
  }, [apiCall]);

  /**
   * Get disease outbreaks
   */
  const getDiseaseOutbreaks = useCallback(async (options = {}) => {
    return apiCall(whoApiService.getDiseaseOutbreaks.bind(whoApiService), options);
  }, [apiCall]);

  /**
   * Get health emergencies
   */
  const getHealthEmergencies = useCallback(async (limit = 5) => {
    return apiCall(whoApiService.getHealthEmergencies.bind(whoApiService), limit);
  }, [apiCall]);

  /**
   * Get comprehensive updates
   */
  const getComprehensiveUpdates = useCallback(async (options = {}) => {
    return apiCall(whoApiService.getComprehensiveUpdates.bind(whoApiService), options);
  }, [apiCall]);

  /**
   * Start monitoring for new updates
   */
  const startMonitoring = useCallback((callback, interval = 300000) => {
    if (monitoringRef.current) {
      monitoringRef.current(); // Stop existing monitoring
    }
    
    monitoringRef.current = whoApiService.startMonitoring(callback, interval);
    
    return () => {
      if (monitoringRef.current) {
        monitoringRef.current();
        monitoringRef.current = null;
      }
    };
  }, []);

  /**
   * Stop monitoring
   */
  const stopMonitoring = useCallback(() => {
    if (monitoringRef.current) {
      monitoringRef.current();
      monitoringRef.current = null;
    }
  }, []);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    whoApiService.clearCache();
  }, []);

  // Cleanup monitoring on unmount
  useEffect(() => {
    return () => {
      if (monitoringRef.current) {
        monitoringRef.current();
      }
    };
  }, []);

  return {
    // State
    loading,
    error,
    data,
    
    // API methods
    fetchNews,
    searchWHO,
    getDiseaseOutbreaks,
    getHealthEmergencies,
    getComprehensiveUpdates,
    
    // Monitoring
    startMonitoring,
    stopMonitoring,
    
    // Utilities
    clearCache,
    
    // Direct access to service (for advanced usage)
    whoApiService
  };
};

// Specialized hooks for specific use cases

/**
 * Hook specifically for WHO news updates
 */
export const useWHONews = (options = {}) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const {
    limit = 10,
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    includeOutbreaks = true,
    includeEmergencies = true
  } = options;

  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const feedTypes = ['news'];
      if (includeOutbreaks) feedTypes.push('diseaseOutbreaks');
      if (includeEmergencies) feedTypes.push('emergencies');

      const data = await whoApiService.fetchNews({
        limit,
        feedTypes
      });

      setUpdates(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching WHO news:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, includeOutbreaks, includeEmergencies]);

  // Initial fetch
  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchUpdates, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchUpdates]);

  const refresh = useCallback(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return {
    updates,
    loading,
    error,
    lastRefresh,
    refresh
  };
};

/**
 * Hook for WHO disease search with debouncing
 */
export const useWHOSearch = (initialQuery = '', debounceMs = 500) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        const searchResults = await whoApiService.searchWHO(debouncedQuery, {
          limit: 20,
          includeNews: true,
          includeFactsheets: false // Factsheets not available in current implementation
        });

        setResults(searchResults);
      } catch (err) {
        setError(err.message);
        console.error('WHO search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasQuery: debouncedQuery.trim().length > 0
  };
};

/**
 * Hook for monitoring WHO disease outbreaks
 */
export const useWHOOutbreaks = (options = {}) => {
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOutbreaks, setNewOutbreaks] = useState([]);

  const {
    limit = 10,
    region = '',
    severity = '',
    enableMonitoring = false,
    monitoringInterval = 600000 // 10 minutes
  } = options;

  const fetchOutbreaks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await whoApiService.getDiseaseOutbreaks({
        limit,
        region,
        severity
      });

      setOutbreaks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching outbreaks:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, region, severity]);

  // Initial fetch
  useEffect(() => {
    fetchOutbreaks();
  }, [fetchOutbreaks]);

  // Monitoring setup
  useEffect(() => {
    if (!enableMonitoring) return;

    const stopMonitoring = whoApiService.startMonitoring((updates) => {
      const outbreakUpdates = updates.filter(update => 
        update.feedType === 'diseaseOutbreaks' ||
        update.category === 'Emergency Alert'
      );
      
      if (outbreakUpdates.length > 0) {
        setNewOutbreaks(prev => [...outbreakUpdates, ...prev]);
        // Optionally auto-refresh main data
        fetchOutbreaks();
      }
    }, monitoringInterval);

    return stopMonitoring;
  }, [enableMonitoring, monitoringInterval, fetchOutbreaks]);

  const clearNewOutbreaks = useCallback(() => {
    setNewOutbreaks([]);
  }, []);

  const refresh = useCallback(() => {
    fetchOutbreaks();
  }, [fetchOutbreaks]);

  return {
    outbreaks,
    loading,
    error,
    newOutbreaks,
    clearNewOutbreaks,
    refresh,
    hasNewOutbreaks: newOutbreaks.length > 0
  };
};

export default useWHOApi;