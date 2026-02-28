import React, { useRef, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Container, Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { productsListAction } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginator from "../components/Paginator";
import styles from "../styles/HeroSection.module.css";
import landingStyles from "../styles/LandingSections.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import videoUtils from "../utils/videoUtils";

function HomeScreen({ setHeaderTransparent, setIsVideoSection }) {
  // get search keyword from the url
  const searchQuery = window.location ? window.location.search : "";
  // Extract actual keyword - only consider it a "search" if keyword is non-empty
  var keyword = "";
  if (searchQuery) {
    keyword = searchQuery.split("keyword=")[1]?.split("&")[0] || "";
  }
  // Only treat as an active search when there's a real keyword
  const isSearching = keyword.trim().length > 0;
  // Initialize AOS for scroll animations (only once)
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      offset: 60,
      easing: "ease-in-out",
      mirror: true,
    });
  }, []);
  // Refresh AOS when searchQuery changes to ensure all sections are visible and animated
  useEffect(() => {
    AOS.refresh();
  }, [searchQuery]);
  // Scroll to products section when page changes (pagination)
  useEffect(() => {
    const params = new URLSearchParams(searchQuery);
    const currentPage = params.get("page");
    if (currentPage && parseInt(currentPage) > 1) {
      setTimeout(() => {
        const productsSection = document.getElementById("products");
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, [searchQuery]);

  const dispatch = useDispatch();
  const products_List = useSelector((state) => state.productsList);
  const { loading, products, error, pages, page } = products_List;

  // Get user login status
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // State for hero product carousel
  const [, setCurrentProductIndex] = useState(0);
  const [, setFocusedSide] = useState(null); // 'left', 'right', or null

  useEffect(() => {
    // Function to check if user is in video section
    const isInVideoSection = () => {
      const videoSection = document.getElementById("video-hero-section");
      if (!videoSection) return false;
    };

    // Set initial transparency based on video section visibility
    const updateHeaderTransparency = () => {
      const inVideoSection = isInVideoSection();
      if (inVideoSection) {
        setHeaderTransparent(true);
        setIsVideoSection && setIsVideoSection(true);
      } else {
        setHeaderTransparent(false);
        setIsVideoSection && setIsVideoSection(false);
      }
    };

    // Initial call
    updateHeaderTransparency();

    const handleScroll = () => {
      updateHeaderTransparency();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setHeaderTransparent, setIsVideoSection]);

  useEffect(() => {
    dispatch(productsListAction(searchQuery));
  }, [dispatch, searchQuery]);

  // Auto-rotate products every 4 seconds
  useEffect(() => {
    if (products && products.length > 1) {
      const interval = setInterval(() => {
        setCurrentProductIndex(
          (prev) => (prev + 1) % Math.min(4, products.length)
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [products]);


  // Sample data for testimonials
  const testimonials = [
    {
      text: "Des produits magnifiques et un service exceptionnel. J'ai adoré mon expérience!",
      author: "Sofia B.",
    },
    {
      text: "La qualité artisanale et le design unique font toute la différence.",
      author: "Karim L.",
    },
    {
      text: "Livraison rapide et produits conformes à la description. Je recommande!",
      author: "Nadia M.",
    },
  ];
  const values = [
    {
      icon: <i className="fas fa-gem"></i>,
      title: "Qualité Artisanale",
      text: "Chaque pièce est réalisée avec soin et passion par nos artisans.",
    },
    {
      icon: <i className="fas fa-shipping-fast"></i>,
      title: "Livraison Rapide",
      text: "Expédition rapide et soignée partout en Algérie.",
    },
    {
      icon: <i className="fas fa-palette"></i>,
      title: "Design Unique",
      text: "Des créations originales qui reflètent l'élégance et la créativité.",
    },
    {
      icon: <i className="fas fa-heart"></i>,
      title: "Satisfaction Client",
      text: "Un service client à l'écoute pour une expérience inoubliable.",
    },
  ];

  // Enhanced video handling with caching and WebM support
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [videosLoaded, setVideosLoaded] = useState({
    left: false,
    right: false,
  });
  const [videoErrors, setVideoErrors] = useState({ left: false, right: false });
  const [, setIsLeftVideoPlaying] = useState(false);
  const [, setIsRightVideoPlaying] = useState(false);
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false);

  // Video caching and optimization
  const videoCache = useRef(new Map());

  // Enhanced video load handler with caching
  const handleVideoLoad = (side) => {
    setVideosLoaded((prev) => ({ ...prev, [side]: true }));

    // Cache the video for future use
    const videoRef = side === "left" ? leftVideoRef : rightVideoRef;
    if (videoRef.current) {
      videoCache.current.set(side, videoRef.current);

      // Optimize video playback
      videoUtils.optimizeVideoPlayback(videoRef.current);
    }
  };

  const handleVideoError = (side) => {
    setVideoErrors((prev) => ({ ...prev, [side]: true }));
    console.warn(`Failed to load ${side} video`);
  };

  // Enhanced hover handler with better performance using videoUtils
  const handleVideoHover = async (side, isHovering) => {
    const videoRef = side === "left" ? leftVideoRef : rightVideoRef;
    const setVideoPlaying =
      side === "left" ? setIsLeftVideoPlaying : setIsRightVideoPlaying;

    if (videoRef.current && videosLoaded[side] && !videoErrors[side]) {
      try {
        if (isHovering) {
          const success = await videoUtils.playVideo(videoRef.current);
          setVideoPlaying(success);
        } else {
          videoUtils.pauseVideo(videoRef.current);
          setVideoPlaying(false);
        }
      } catch (error) {
        console.warn(`Video ${isHovering ? "play" : "pause"} failed:`, error);
        setVideoPlaying(false);
      }
    }
  };

  // Intersection observer for lazy loading videos with better performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideos(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px", // Start loading 50px before video comes into view
      }
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized video preloading with WebM support and caching
  useEffect(() => {
    if (!shouldLoadVideos) return;

    const preloadVideo = async (side) => {
      // Check if video is already cached
      if (videoCache.current.has(side)) {
        handleVideoLoad(side);
        return;
      }

      try {
        // Get the best video format for the browser
        const videoName = side === "left" ? "left-video" : "right-video";
        const videoSrc = videoUtils.getBestVideoFormat(videoName);

        // Use videoUtils to preload
        videoUtils.preloadVideo(
          videoSrc,
          () => handleVideoLoad(side),
          () => handleVideoError(side)
        );
      } catch (error) {
        console.warn(`Failed to preload ${side} video:`, error);
        handleVideoError(side);
      }
    };

    // Preload both videos
    preloadVideo("left");
    preloadVideo("right");
  }, [shouldLoadVideos]);

  // Ensure videos are paused and at first frame when component mounts
  useEffect(() => {
    if (leftVideoRef.current && videosLoaded.left) {
      leftVideoRef.current.currentTime = 0;
      leftVideoRef.current.pause();
    }
    if (rightVideoRef.current && videosLoaded.right) {
      rightVideoRef.current.currentTime = 0;
      rightVideoRef.current.pause();
    }
  }, [videosLoaded.left, videosLoaded.right]);

  // Cleanup video cache on unmount
  useEffect(() => {
    const cache = videoCache.current;
    return () => {
      cache.clear();
    };
  }, []);

  const navigate = useNavigate();

  // Animation helper
  const animateButton = (e) => {
    e.target.classList.add(styles.heroButtonClick);
    setTimeout(() => {
      e.target.classList.remove(styles.heroButtonClick);
    }, 300);
  };

  return (
    <div
      className={landingStyles.landingBg}
      style={{
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        position: "relative",
        top: 0,
        left: 0,
        overflow: "hidden",
        background: `radial-gradient(ellipse 120% 80% at 50% 20%, #f8f6f2 80%, #e9e4d9 100%), linear-gradient(120deg, #f8f6f2 0%, #e9e4d9 100%)`,
      }}
    >
      {/* Gold shimmer effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "linear-gradient(120deg, rgba(255,215,120,0.08) 0%, rgba(255,255,255,0.01) 100%)",
          mixBlendMode: "screen",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Subtle vignette for depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "radial-gradient(ellipse 100% 80% at 50% 60%, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0.18) 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Faint luxury pattern overlay (SVG) */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="luxuryPattern"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#d6cfc2"
            strokeWidth="2"
            opacity="0.08"
          />
          <circle
            cx="60"
            cy="60"
            r="24"
            fill="none"
            stroke="#bfae8f"
            strokeWidth="1"
            opacity="0.07"
          />
        </pattern>
        <rect width="1920" height="1080" fill="url(#luxuryPattern)" />
      </svg>
      {/* Soft blur effect for extra elegance */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backdropFilter: "blur(6px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Dior-style Hero Section - Responsive Split */}
      {!isSearching && (
        <section
          id="video-hero-section"
          ref={heroSectionRef}
          className={styles.diorHeroSection}
        >
          <div className={styles.diorHeroVideosWrapper}>
            {/* Top/Left Video Side */}
            <div
              className={styles.diorHeroSide}
              onMouseEnter={() => {
                setFocusedSide("left");
                handleVideoHover("left", true);
              }}
              onMouseLeave={() => {
                setFocusedSide(null);
                handleVideoHover("left", false);
              }}
              style={{ position: "relative" }}
            >
              {/* Loading placeholder */}
              {!videosLoaded.left && !videoErrors.left && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    color: "#666",
                    fontSize: "1.2rem",
                  }}
                >
                  Chargement...
                </div>
              )}

              {/* Error fallback - show a nice background */}
              {videoErrors.left && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <div style={{ color: "white", textAlign: "center" }}>
                    <i
                      className="fas fa-image"
                      style={{ fontSize: "3rem", marginBottom: "1rem" }}
                    ></i>
                    <div>Contenu de démonstration</div>
                  </div>
                </div>
              )}

              <video
                ref={leftVideoRef}
                className={styles.diorHeroVideo}
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/posters/left-video-poster.jpg"
                onLoadedMetadata={() => handleVideoLoad("left")}
                onError={() => handleVideoError("left")}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  opacity: videosLoaded.left ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {/* Multiple video formats for better compression and compatibility */}
                <source
                  src="/videos/left-video.webm"
                  type="video/webm; codecs=vp9"
                />
                <source src="/videos/left-video.webm" type="video/webm" />
                <source src="/videos/left-video.mp4" type="video/mp4" />
                {/* Fallback for older browsers */}
                <source src="/videos/left-video.mp4" type="video/mp4" />
              </video>
              {/* Removed darkness effect on hover */}
              <div
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  zIndex: 2,
                  maxWidth: "400px",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    fontFamily: "serif",
                    fontSize: "2rem",
                    marginBottom: 24,
                    letterSpacing: 2,
                    fontWeight: 300,
                    lineHeight: 1.2,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    color: "white",
                    ...(window.innerWidth <= 900
                      ? { fontSize: "0rem", marginBottom: 16 }
                      : {}),
                  }}
                >
                  Découvrez l'élégance avec Vix Fragrance
                </h2>
                <button
                  style={{
                    padding:
                      window.innerWidth <= 900 ? "12px 24px" : "16px 32px",
                    background: "rgba(255,255,255,0.9)",
                    color: "#1a1a1a",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    fontSize: window.innerWidth <= 900 ? "0.85rem" : "1rem",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  onClick={(e) => {
                    animateButton(e);
                    const productsSection = document.getElementById("products");
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255,255,255,1)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "rgba(255,255,255,0.9)")
                  }
                  className={styles.heroButton}
                >
                  Découvrir notre collection
                </button>
              </div>
            </div>
            {/* Centered Logo/Text (desktop only, hidden on mobile) */}
            <div className={styles.diorHeroLogoWrapper}>
              <div
                style={{
                  textAlign: "center",
                  userSelect: "none",
                  maxWidth: "100%",
                  filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))",
                }}
              >
                {/* VIX - bold prominent style matching logo */}
                <div
                  style={{
                    fontSize: "6rem",
                    fontWeight: 800,
                    marginBottom: "0.1rem",
                    color: "white",
                    lineHeight: 1,
                    letterSpacing: "0.05em",
                    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  VIX
                </div>

                {/* FRAGRANCE - smaller with wide letter spacing matching logo */}
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 400,
                    letterSpacing: "0.45em",
                    marginBottom: "-0.1rem",
                    lineHeight: 1,
                    color: "white",
                    textTransform: "uppercase",
                    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  }}
                >
                  FRAGRANCE
                </div>
              </div>
            </div>
            {/* Bottom/Right Video Side */}
            <div
              className={styles.diorHeroSide}
              onMouseEnter={() => {
                setFocusedSide("right");
                handleVideoHover("right", true);
              }}
              onMouseLeave={() => {
                setFocusedSide(null);
                handleVideoHover("right", false);
              }}
              style={{ position: "relative" }}
            >
              {/* Loading placeholder */}
              {!videosLoaded.right && !videoErrors.right && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    color: "#666",
                    fontSize: "1.2rem",
                  }}
                >
                  Chargement...
                </div>
              )}

              {/* Error fallback */}
              {videoErrors.right && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <div style={{ color: "white", textAlign: "center" }}>
                    <i
                      className="fas fa-image"
                      style={{ fontSize: "3rem", marginBottom: "1rem" }}
                    ></i>
                    <div>Contenu de démonstration</div>
                  </div>
                </div>
              )}

              <video
                ref={rightVideoRef}
                className={styles.diorHeroVideo}
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/posters/right-video-poster.jpg"
                onLoadedMetadata={() => handleVideoLoad("right")}
                onError={() => handleVideoError("right")}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  opacity: videosLoaded.right ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {/* Multiple video formats for better compression and compatibility */}
                <source
                  src="/videos/right-video.webm"
                  type="video/webm; codecs=vp9"
                />
                <source src="/videos/right-video.webm" type="video/webm" />
                <source src="/videos/right-video.mp4" type="video/mp4" />
                {/* Fallback for older browsers */}
                <source src="/videos/right-video.mp4" type="video/mp4" />
              </video>
              {/* Removed darkness effect on hover */}
              <div
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  zIndex: 2,
                  maxWidth: "400px",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    fontFamily: "serif",
                    fontSize: "2rem",
                    marginBottom: 32,
                    letterSpacing: 2,
                    fontWeight: 300,
                    lineHeight: 1.2,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    color: "white",
                  }}
                >
                  Faites partie de Vix Fragrance
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {userInfo ? (
                    // Show Profile button when user is logged in
                    <button
                      type="button"
                      style={{
                        padding: "14px 28px",
                        background: "rgba(255,255,255,0.9)",
                        color: "#1a1a1a",
                        fontWeight: 500,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        width: "fit-content",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        animateButton(e);
                        setTimeout(() => {
                          navigate("/profile");
                        }, 200);
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "rgba(255,255,255,1)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "rgba(255,255,255,0.9)")
                      }
                      className={styles.heroButton}
                    >
                      Profile
                    </button>
                  ) : (
                    // Show Sign In and Sign Up buttons when user is not logged in
                    <>
                      <button
                        type="button"
                        style={{
                          padding: "14px 28px",
                          background: "rgba(255,255,255,0.9)",
                          color: "#1a1a1a",
                          fontWeight: 500,
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          width: "fit-content",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          animateButton(e);
                          setTimeout(() => {
                            navigate("/login");
                          }, 200);
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "rgba(255,255,255,1)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "rgba(255,255,255,0.9)")
                        }
                        className={styles.heroButton}
                      >
                        Sign In
                      </button>
                      <button
                        style={{
                          padding: "14px 28px",
                          background: "transparent",
                          color: "white",
                          fontWeight: 500,
                          border: "2px solid rgba(255,255,255,0.8)",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          transition: "all 0.3s ease",
                          width: "fit-content",
                        }}
                        onClick={(e) => {
                          animateButton(e);
                          navigate("/register");
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(255,255,255,0.1)";
                          e.target.style.borderColor = "rgba(255,255,255,1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.borderColor = "rgba(255,255,255,0.8)";
                        }}
                        className={styles.heroButton}
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Container className={landingStyles.sectionsContainer}>
        {/* About Section */}
        {!isSearching && (
          <section id="about" className={landingStyles.aboutSection}>
            <h2 className={landingStyles.aboutTitle}>
              À propos de VIX FRAGRANCE
            </h2>
            <p className={landingStyles.aboutText}>
              VIX FRAGRANCE est une maison de création dédiée à l'artisanat
              d'excellence et au design contemporain. Nous croyons en la beauté
              des détails, l'authenticité des matières et la passion du
              fait-main. Découvrez une collection unique, pensée pour sublimer
              votre quotidien.
            </p>
          </section>
        )}

        {/* Values Section */}
        {!isSearching && (
          <section className={landingStyles.valuesSection}>
            <div className={landingStyles.valuesGrid}>
              {values.map((val, idx) => (
                <div className={landingStyles.valueCard} key={idx}>
                  <div className={landingStyles.valueIcon}>{val.icon}</div>
                  <div className={landingStyles.valueTitle}>{val.title}</div>
                  <div className={landingStyles.valueText}>{val.text}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {!isSearching && (
          <section className={landingStyles.testimonialsSection}>
            <h2 className={landingStyles.testimonialsTitle}>
              Ils parlent de nous
            </h2>
            <div className={landingStyles.testimonialsGrid}>
              {testimonials.map((t, idx) => (
                <div className={landingStyles.testimonialCard} key={idx}>
                  <div className={landingStyles.testimonialText}>
                    "{t.text}"
                  </div>
                  <div className={landingStyles.testimonialAuthor}>
                    - {t.author}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Product Catalog Section */}
        <section className={landingStyles.productsSection}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : products && products.length === 0 ? (
            <div className="text-center py-5">
              <Message variant="info">
                <h4>Aucun Produit Trouvé</h4>
                <p className="mt-2">
                  Essayez un terme de recherche différent ou parcourez nos
                  catégories
                </p>
              </Message>
            </div>
          ) : (
            <div id="products">
              <div className="my-4">
                <h2 className={searchQuery ? "mb-4" : "mb-4"}>
                  {isSearching
                    ? `Résultats de Recherche pour "${keyword}"`
                    : "Tous les Produits"}
                </h2>
                <Row>
                  {products &&
                    products.length > 0 &&
                    products.map((productitem) => (
                      <Col
                        key={productitem.id}
                        sm={12}
                        md={6}
                        lg={4}
                        xl={3}
                        className="mb-4"
                      >
                        <Product product={productitem} />
                      </Col>
                    ))}
                </Row>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Paginator pages={pages} page={page} keyword={keyword} />
              </div>
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}

HomeScreen.propTypes = {
  setHeaderTransparent: PropTypes.func,
  setIsVideoSection: PropTypes.func,
};

export default HomeScreen;
