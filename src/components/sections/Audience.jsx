import React from 'react';

function Audience() {
  const styles = {
    audience: {
      padding: '90px 20px',
      paddingTop: '110px',
      background: 'linear-gradient(135deg, var(--color-fourth) 0%, #f8fdfe 50%, var(--color-primary) 100%)',
      textAlign: 'center',
      minHeight: '100vh',
      position: 'relative',
      margin: 0
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    h2: {
      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
      marginBottom: '60px',
      marginTop: 0,
      background: 'linear-gradient(135deg, var(--color-secondary), var(--color-third))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontFamily: "'Merriweather', serif",
      fontWeight: 600,
      position: 'relative'
    },
    h2After: {
      content: "''",
      width: '80px',
      height: '4px',
      background: 'linear-gradient(90deg, var(--color-secondary), var(--color-third))',
      margin: '20px auto 0',
      display: 'block',
      borderRadius: '2px'
    },
    audienceRows: {
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      marginTop: '60px'
    },
    audienceRow: {
      width: '100%'
    },
    audienceCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '40px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '30px',
      padding: '40px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    audienceCardBefore: {
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, var(--color-secondary), var(--color-third))',
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.4s ease'
    },
    audienceCardBeforeHover: {
      transform: 'scaleX(1)'
    },
    audienceCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    contentWrapper: {
      flex: 1,
      textAlign: 'left'
    },
    imageWrapper: {
      flex: '0 0 300px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    audienceCardRow1Row3: {
      flexDirection: 'row'
    },
    audienceCardRow2: {
      flexDirection: 'row',
      gap: '40px'
    },
    h3: {
      fontSize: '2rem',
      marginBottom: '20px',
      color: 'var(--color-dark)',
      fontFamily: "'Merriweather', serif",
      fontWeight: 600,
      position: 'relative'
    },
    ul: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    li: {
      fontSize: '1.1rem',
      marginBottom: '12px',
      color: '#555',
      display: 'flex',
      alignItems: 'flex-start',
      position: 'relative',
      transition: 'all 0.3s ease',
      padding: '8px 0',
      gap: '12px'
    },
    liContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flex: 1
    },
    liTitle: {
      fontWeight: 'bold',
      color: 'var(--color-dark)',
      fontSize: '1.05rem'
    },
    liDescription: {
      fontSize: '0.95rem',
      lineHeight: '1.5',
      color: '#666'
    },
    liHover: {
      color: 'var(--color-secondary)'
    },
    liHoverRow1Row3: {
      transform: 'translateX(5px)'
    },
    liBefore: {
      content: "'✓'",
      color: 'var(--color-secondary)',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      width: '24px',
      height: '24px',
      minWidth: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(13, 157, 184, 0.1)',
      borderRadius: '50%',
      flexShrink: 0,
      transition: 'all 0.3s ease',
      marginTop: '2px'
    },
    liBeforeHover: {
      background: 'rgba(13, 157, 184, 0.2)',
      transform: 'scale(1.1)'
    },
    img: {
      width: '100%',
      maxWidth: '280px',
      height: 'auto',
      borderRadius: '15px',
      transition: 'transform 0.3s ease',
      filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))'
    },
    imgHover: {
      transform: 'scale(1.05)'
    },
    row1Animation: {
      animation: 'slideInLeft 0.8s ease-out'
    },
    row2Animation: {
      animation: 'slideInRight 0.8s ease-out 0.2s both'
    },
    row3Animation: {
      animation: 'slideInLeft 0.8s ease-out 0.4s both'
    }
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [hoveredLi, setHoveredLi] = React.useState({});

  const mediaQueryMobile = window.matchMedia('(max-width: 768px)');
  const mediaQuerySmall = window.matchMedia('(max-width: 480px)');

  const getResponsiveStyles = () => {
    if (mediaQuerySmall.matches) {
      return {
        audience: {
          ...styles.audience,
          padding: '40px 15px',
          paddingTop: '80px'
        },
        audienceCard: {
          ...styles.audienceCard,
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px 15px',
          gap: '20px'
        },
        contentWrapper: {
          ...styles.contentWrapper,
          textAlign: 'center'
        },
        h2: {
          ...styles.h2,
          marginBottom: '40px'
        },
        h3: {
          ...styles.h3,
          fontSize: '1.3rem',
          marginBottom: '15px'
        },
        li: {
          ...styles.li,
          fontSize: '0.9rem',
          padding: '6px 0',
          gap: '10px',
          alignItems: 'flex-start',
          textAlign: 'left'
        },
        liTitle: {
          ...styles.liTitle,
          fontSize: '0.95rem'
        },
        liDescription: {
          ...styles.liDescription,
          fontSize: '0.85rem',
          lineHeight: '1.4'
        },
        liBefore: {
          ...styles.liBefore,
          width: '20px',
          height: '20px',
          minWidth: '20px',
          fontSize: '1rem'
        },
        img: {
          ...styles.img,
          maxWidth: '180px'
        },
        imageWrapper: {
          ...styles.imageWrapper,
          flex: 'none',
          order: -1
        },
        audienceRows: {
          ...styles.audienceRows,
          gap: '25px'
        }
      };
    } else if (mediaQueryMobile.matches) {
      return {
        audience: {
          ...styles.audience,
          padding: '50px 15px',
          paddingTop: '90px'
        },
        audienceCard: {
          ...styles.audienceCard,
          flexDirection: 'column',
          textAlign: 'center',
          padding: '30px 20px',
          gap: '30px'
        },
        contentWrapper: {
          ...styles.contentWrapper,
          textAlign: 'center'
        },
        h3: {
          ...styles.h3,
          fontSize: '1.5rem'
        },
        li: {
          ...styles.li,
          fontSize: '0.95rem',
          alignItems: 'flex-start',
          textAlign: 'left'
        },
        liTitle: {
          ...styles.liTitle,
          fontSize: '1rem'
        },
        liDescription: {
          ...styles.liDescription,
          fontSize: '0.9rem'
        },
        img: {
          ...styles.img,
          maxWidth: '200px'
        },
        imageWrapper: {
          ...styles.imageWrapper,
          flex: 'none',
          order: -1
        },
        audienceRows: {
          ...styles.audienceRows,
          gap: '30px'
        }
      };
    }
    return {};
  };

  const responsiveStyles = getResponsiveStyles();

  const contentData = [
    {
      id: 1,
      title: 'For Individuals',
      image: '/assets/wtt-1.svg',
      items: [
        { title: 'Instant Analysis:', desc: 'Check your symptoms privately with clinical-grade AI.' },
        { title: 'Verified Knowledge:', desc: 'Access a library of medically reviewed health conditions.' },
        { title: 'Actionable Advice:', desc: 'Know exactly whether to see a doctor or treat at home.' },
        { title: 'Health Mastery:', desc: 'Understand medical terms in simple, clear language.' },
        { title: '24/7 Access:', desc: 'Get answers anytime, without waiting for an appointment.' }
      ]
    },
    {
      id: 2,
      title: 'For Parents',
      image: '/assets/wtt-2.svg',
      items: [
        { title: 'Pediatric Focus:', desc: 'Symptom checks tailored specifically for children and infants.' },
        { title: 'Urgency Detection:', desc: 'Instantly understand if your child needs emergency care.' },
        { title: 'Age-Smart:', desc: 'Accurate analysis adapted for newborns, toddlers, and teens.' },
        { title: 'Home Relief:', desc: 'Safe, doctor-approved tips to manage fevers and minor ailments.' },
        { title: 'Peace of Mind:', desc: 'Reduce anxiety with reliable guidance day or night.' }
      ]
    },
    {
      id: 3,
      title: 'For Caregivers',
      image: '/assets/wtt-3.svg',
      items: [
        { title: 'Remote Assessment:', desc: 'Check symptoms on behalf of parents or partners.' },
        { title: 'Decision Support:', desc: 'Validate your concerns before rushing to the hospital.' },
        { title: 'Care Coordination:', desc: 'Easily explain symptoms to doctors using generated reports.' },
        { title: 'Elderly Care:', desc: 'Specialized insights for age-related health conditions.' },
        { title: 'Emergency Prep:', desc: 'Quick access to triage advice when every second counts.' }
      ]
    }
  ];

  return (
    <section style={{ ...styles.audience, ...responsiveStyles.audience }}>
      <style>
        {`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <h2 style={{ ...styles.h2, ...responsiveStyles.h2 }}>
          Support for Every Stage of Life
          <span style={styles.h2After}></span>
        </h2>

        <div style={{ ...styles.audienceRows, ...responsiveStyles.audienceRows }}>
          {contentData.map((section, index) => {
            const rowId = `audience-row-${section.id}`;
            const isRow2 = section.id === 2;
            const animationStyle = index === 0 ? styles.row1Animation : index === 1 ? styles.row2Animation : styles.row3Animation;

            return (
              <div key={section.id} style={{ ...styles.audienceRow, ...animationStyle }} id={rowId}>
                <div
                  style={{
                    ...(responsiveStyles.audienceCard || styles.audienceCard),
                    ...(!mediaQueryMobile.matches ? (isRow2 ? styles.audienceCardRow2 : styles.audienceCardRow1Row3) : {}),
                    ...(hoveredCard === section.id ? styles.audienceCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(section.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <span style={{
                    ...styles.audienceCardBefore,
                    ...(hoveredCard === section.id ? styles.audienceCardBeforeHover : {})
                  }}></span>

                  <div style={{ ...styles.imageWrapper, ...responsiveStyles.imageWrapper }}>
                    <img
                      src={section.image}
                      alt={section.title}
                      style={{
                        ...styles.img,
                        ...responsiveStyles.img,
                        ...(hoveredCard === section.id ? styles.imgHover : {})
                      }}
                    />
                  </div>

                  <div style={{ ...styles.contentWrapper, ...responsiveStyles.contentWrapper }}>
                    <h3 style={{ ...styles.h3, ...responsiveStyles.h3 }}>{section.title}</h3>
                    <ul style={styles.ul}>
                      {section.items.map((item, itemIndex) => {
                        const itemKey = `${section.id}-${itemIndex}`;
                        return (
                          <li
                            key={itemKey}
                            style={{
                              ...styles.li,
                              ...responsiveStyles.li,
                              ...(hoveredLi[itemKey] && !mediaQueryMobile.matches ? { ...styles.liHover, ...styles.liHoverRow1Row3 } : hoveredLi[itemKey] ? styles.liHover : {})
                            }}
                            onMouseEnter={() => setHoveredLi({ ...hoveredLi, [itemKey]: true })}
                            onMouseLeave={() => setHoveredLi({ ...hoveredLi, [itemKey]: false })}
                          >
                            <span style={{
                              ...styles.liBefore,
                              ...responsiveStyles.liBefore,
                              ...(hoveredLi[itemKey] ? styles.liBeforeHover : {})
                            }}>✓</span>
                            <div style={styles.liContent}>
                              <span style={{ ...styles.liTitle, ...responsiveStyles.liTitle }}>{item.title}</span>
                              <span style={{ ...styles.liDescription, ...responsiveStyles.liDescription }}>{item.desc}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Audience;