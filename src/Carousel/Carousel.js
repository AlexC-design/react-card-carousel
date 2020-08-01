import React, { useState } from "react";
import "./css/carousel.css";

const Carousel = () => {
  const [slideHeight, setSlideHeight] = useState(320);
  const [slideWidth, setSlideWitdh] = useState(200);
  const [carouselWidth, setCarouselWidth] = useState(900);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const [controlDisabled, setControlDisabled] = useState("none");

  const slides = new Array(20).fill("test");

  const indexToPosition = index => {
    if (activeSlideIndex - 1 <= 0) {
      if (index === slides.length - (2 - activeSlideIndex)) return "first";
      if (index === slides.length - (1 - activeSlideIndex)) return "second";
    }
    if (activeSlideIndex >= slides.length - 2) {
      if (index === activeSlideIndex - slides.length + 2) return "last";
      if (index === activeSlideIndex - slides.length + 1) return "fourth";
    }
    if (index < activeSlideIndex - 2) return "left";
    if (index === activeSlideIndex - 2) return "first";
    if (index === activeSlideIndex - 1) return "second";
    if (index === activeSlideIndex) return "center";
    if (index === activeSlideIndex + 1) return "fourth";
    if (index === activeSlideIndex + 2) return "last";
    if (index > activeSlideIndex + 2) return "right";
  };

  const slideStyle = {
    height: `${slideHeight}px`,
    width: `${slideWidth}px`
  };

  const slidesContainerStyle = {
    width: carouselWidth,
    height: slideHeight,
    transform: `translateX(-${slideWidth / 2}px)`
  };

  const disableControl = side => {
    setControlDisabled(side);
    setTimeout(() => {
      setControlDisabled("none");
    }, 100);
  };

  const nextSlide = () => {
    if (activeSlideIndex === slides.length - 1) {
      setActiveSlideIndex(0);
    } else {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
    disableControl("right");
  };
  const prevSlide = () => {
    if (activeSlideIndex === 0) {
      setActiveSlideIndex(slides.length - 1);
    } else {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
    disableControl("left");
  };

  return (
    <div className="main-container">
      <div className="carousel-container">
        <div className="slides-container" style={slidesContainerStyle}>
          {slides.map((slide, index) => (
            <div
              className={`slide ${indexToPosition(index)}`}
              key={index}
              style={slideStyle}
            >
              {index}
            </div>
          ))}
        </div>
        <div className="carousel-controls">
          <div
            className={`control left ${
              controlDisabled === "left" ? "disabled" : ""
            }`}
            onClick={prevSlide}
          />
          <div
            className={`control right ${
              controlDisabled === "right" ? "disabled" : ""
            }`}
            onClick={nextSlide}
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
