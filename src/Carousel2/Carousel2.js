import React, { useState, useEffect } from "react";
import "./css/carousel2.css";

const Carousel = () => {
  const [slideHeight, setSlideHeight] = useState(500);
  const [slideWidth, setSlideWitdh] = useState(0);
  const [preferredSlideWidth, setPreferredSlideWitdh] = useState(500);
  const [carouselWidth, setCarouselWidth] = useState(900);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [controlDisabled, setControlDisabled] = useState("none");
  const [slices, setSlices] = useState([]);
  const [slicePercentage, setSlicePercentage] = useState({ left: 1, right: 1 });
  const [slidePadding, setSlidePadding] = useState(0.95);

  const slides = new Array(30).fill("test");

  // ------------------------- INDEX TO VALUES -------------------------
  const indexToPosition = index => {
    return (
      50 + slices[index] * slicePercentage[slices[index] < 0 ? "left" : "right"]
    );
  };

  const indexToSize = index => {
    return 1;
    const sizeFromIndex = 1 - Math.abs(slices[index]) / 10;
    return sizeFromIndex > 0 ? sizeFromIndex : 0;
  };

  const indexToOpacity = index => {
    return 1;
    return 1 - Math.abs(slices[index]) / 4;
  };

  const indexToCoverOpacity = index => {
    return Math.abs(slices[index]) / 10;
    return 0;
  };

  const indexToZIndex = index => {
    return Math.floor(slides.length / 2) - Math.abs(slices[index]);
  };

  // ------------------------- STYLES -------------------------
  const slideStyle = index => {
    return {
      height: `${slideHeight}px`,
      width: `${slideWidth}px`,
      zIndex: indexToZIndex(index),
      left: `${indexToPosition(index)}%`,
      opacity: indexToOpacity(index),
      transform: `scale(${indexToSize(index)})`
    };
  };

  const coverStyle = index => {
    return {
      opacity: indexToCoverOpacity(index)
    };
  };

  const slidesContainerStyle = {
    width: carouselWidth,
    height: slideHeight,
    transform: `translateX(-${
      window.innerWidth > slideWidth
        ? slideWidth / 2
        : (window.innerWidth * slidePadding) / 2
    }px)`
  };

  // ------------------------- SLIDE FUNCTIONS -------------------------
  const disableControl = side => {
    setControlDisabled(side);
    setTimeout(() => {
      setControlDisabled("none");
    }, 300);
  };

  const nextSlide = () => {
    let slicesArray = [...slices];
    setSlices([slicesArray.pop()].concat(slicesArray));

    if (activeSlideIndex === slides.length - 1) {
      setActiveSlideIndex(0);
    } else {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
    disableControl("right");
  };
  const prevSlide = () => {
    let slicesArray = [...slices];
    setSlices(slicesArray.concat(slicesArray.shift()));

    if (activeSlideIndex === 0) {
      setActiveSlideIndex(slides.length - 1);
    } else {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
    disableControl("left");
  };

  // ------------------------- MOUNT -------------------------
  useEffect(() => {
    //creating slices array [0, 1, 2 ... L/2 ... -2, -1]
    let slicesArray = [];
    for (let i = 0; i <= slides.length / 2; i++) {
      slicesArray[i] = i;
    }
    for (
      let i = Math.floor(slides.length / 2) + 1;
      i <= slides.length - 1;
      i++
    ) {
      slicesArray[i] = -(slides.length - i);
    }
    setSlices(slicesArray);

    //calculating percentage of distance between each card on both sides of the active one
    setSlicePercentage({
      left: 100 / Math.floor((slides.length - 1) / 2) / 2,
      right: 100 / Math.floor(slides.length / 2) / 2
    });

    // resize slide to fit screen width
    setSlideWitdh(preferredSlideWidth);

    if (window.innerWidth * slidePadding < preferredSlideWidth) {
      setSlideWitdh(window.innerWidth * slidePadding);
    }
  }, []);

  // ------------------------- UPDATE -------------------------
  useEffect(() => {
    console.log(slices);
    console.log(slicePercentage);

    let timeoutId;
    window.addEventListener("resize", () => {
      timeoutId = setTimeout(() => {
        if (window.innerWidth * slidePadding <= preferredSlideWidth) {
          setSlideWitdh(window.innerWidth * slidePadding);
        } else {
          setSlideWitdh(preferredSlideWidth);
        }
      }, 500);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return (
    <div className="main-container">
      <div className="carousel-container">
        <div className="slides-container" style={slidesContainerStyle}>
          {slides.map((slide, index) => (
            <div className="slide" key={index} style={slideStyle(index)}>
              <div className="slide-content">
                <div className="cover" style={coverStyle(index)} />
                <p>{index}</p>
                <p>{slideWidth}px</p>
              </div>
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
