import { useEffect, useState } from "react";

export default function PhotoGallery({ photos, hotelName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const showNext = () => setActiveIndex((i) => (i + 1) % photos.length);
  const showPrev = () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, photos.length]);

  if (!photos.length) return null;

  return (
    <div className="gallery">
      <button
        className="gallery__main"
        onClick={() => setLightboxOpen(true)}
        aria-label="Open full-size photo"
      >
        <img src={photos[activeIndex]} alt={`${hotelName} view ${activeIndex + 1}`} />
      </button>

      <div className="gallery__thumbs">
        {photos.map((photo, i) => (
          <button
            key={photo + i}
            className={`gallery__thumb ${i === activeIndex ? "gallery__thumb--active" : ""}`}
            onClick={() => setActiveIndex(i)}
          >
            <img src={photo} alt="" />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox__close" aria-label="Close" onClick={() => setLightboxOpen(false)}>
            ×
          </button>
          {photos.length > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
              >
                ‹
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
              >
                ›
              </button>
            </>
          )}
          <img
            src={photos[activeIndex]}
            alt={`${hotelName} full view`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
