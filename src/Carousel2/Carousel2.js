import React, { useState, useEffect } from "react";
import "./css/carousel2.css";

const Carousel = () => {
  const [slideHeight, setSlideHeight] = useState(100);
  const [slideWidth, setSlideWitdh] = useState(0);
  const [preferredSlideWidth, setPreferredSlideWitdh] = useState(100);
  const [carouselWidth, setCarouselWidth] = useState(900);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [controlDisabled, setControlDisabled] = useState("none");
  const [slices, setSlices] = useState([]);
  const [slicePercentage, setSlicePercentage] = useState({ left: 1, right: 1 });
  const [slidePadding, setSlidePadding] = useState(0.95);

  const slides = new Array(20).fill("test");

  // ------------------------- INDEX TO VALUES -------------------------
  const indexToPosition = index => {
    return (
      50 +
      slices[index] *
        (slicePercentage[slices[index] < 0 ? "left" : "right"] +
          8 -
          Math.abs(slices[index]))
    );
  };

  const indexToSize = index => {
    const sizeFromIndex = 1 - Math.abs(slices[index]) / 10;
    return sizeFromIndex > 0 ? sizeFromIndex : 0;
    return 1;
  };

  const indexToOpacity = index => {
    return 1;
    return 1 - Math.abs(slices[index]) / 10;
  };

  const indexToCoverOpacity = index => {
    return (Math.abs(slices[index]) / 80) * Math.abs(slices[index]);
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

  // ------------------------- GESTURE SWIPE -------------------------

  let initialPosition = 0;
  let currentPosition = 0;

  function handleDrag(e) {
    if (initialPosition === 0) {
      initialPosition = e.clientX;
    } else {
      currentPosition = e.clientX;
      console.log(initialPosition - currentPosition);
      if (initialPosition - currentPosition > 50) {
        nextSlide();
      }
      if (initialPosition - currentPosition < -50) {
        prevSlide();
      }
    }
  }

  const handleClick = () => {
    console.log("draging");
    window.addEventListener("mousemove", handleDrag);
  };
  const handleRelease = () => {
    console.log("released");
    window.removeEventListener("mousemove", handleDrag);
  };

  // ------------------------- MOUNT -------------------------
  useEffect(() => {
    console.log("MOUNTED");
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
    console.log("UPDATING");

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
      handleRelease();
    };
  });

  return (
    <div
      className="main-container"
      onMouseDown={handleClick}
      onMouseUp={handleRelease}
    >
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
