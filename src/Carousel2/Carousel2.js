import React, { useState, useEffect } from "react";
import "./css/carousel2.css";
import Slider from "../Slider/Slider";

const Carousel = () => {
  const [slideHeight, setSlideHeight] = useState(500);
  const [slideWidth, setSlideWidth] = useState(0);
  const [preferredSlideWidth, setPreferredSlideWidth] = useState(500);
  const [carouselWidth, setCarouselWidth] = useState(200);
  const [controlDisabled, setControlDisabled] = useState("none");
  const [slices, setSlices] = useState([]);
  const [slicePercentage, setSlicePercentage] = useState({ left: 1, right: 1 });
  const [animationsOff, setAnimationsOff] = useState(false);
  const [numberOfSlides, setNumberOfSlides] = useState(7);
  const [distanceBetweenSlides, setDistanceBetweenSlides] = useState(10);
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  const [slidesContainerStyle, setSlidesContainerStyle] = useState({});

  const slides = new Array(numberOfSlides).fill("test");

  // ------------------------- INDEX TO VALUES -------------------------
  const indexToPosition = index => {
    return (
      50 +
      slices[index] *
        (slicePercentage[slices[index] < 0 ? "left" : "right"] +
          distanceBetweenSlides -
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

  const activeSlideStyle = index => {
    return {
      ...slideStyle(index)
    };
  };

  const coverStyle = index => {
    return {
      opacity: indexToCoverOpacity(index)
    };
  };

  const toggleAnimations = () => {
    setAnimationsOff(!animationsOff);
  };

  // ------------------------- SLIDE FUNCTIONS -------------------------
  const nextSlide = () => {
    let slicesArray = [...slices];
    setSlices([slicesArray.pop()].concat(slicesArray));
    disableControl("right");
  };
  const prevSlide = () => {
    let slicesArray = [...slices];
    setSlices(slicesArray.concat(slicesArray.shift()));
    disableControl("left");
  };

  const jumpToSlide = index => {
    let slicesArray = [];
    let currentSlice = 0;

    const incrementCurrentSlice = () => {
      currentSlice < (slides.lenth - 1) / 2
        ? currentSlice++
        : currentSlice === (slides.length - 1) / 2
        ? (currentSlice *= -1)
        : currentSlice++;
    };

    for (let i = index; i <= slides.length - 1; i++) {
      slicesArray[i] = currentSlice;
      incrementCurrentSlice();
    }

    for (let i = 0; i < index; i++) {
      slicesArray[i] = currentSlice;
      incrementCurrentSlice();
    }

    setSlices(slicesArray);
  };

  const disableControl = side => {
    setControlDisabled(side);
    setTimeout(() => {
      setControlDisabled("none");
    }, 300);
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
    window.addEventListener("mousemove", handleDrag);
  };
  const handleRelease = () => {
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
    setSlideWidth(preferredSlideWidth);

    if (window.innerWidth < preferredSlideWidth) {
      setSlideWidth(window.innerWidth);
    }
  }, [preferredSlideWidth, carouselWidth]);

  //--------------------- UPDATE SLIDES CONTAINER STYLE (NOT WORKING)
  useEffect(() => {
    setSlidesContainerStyle({
      width: carouselWidth,
      height: slideHeight,
      transform: `translateX(-${
        window.innerWidth > slideWidth ? slideWidth / 2 : window.innerWidth / 2
      }px)`
    });
    console.log(slidesContainerStyle);
  }, [slideHeight, slideWidth]);

  // ------------------------- UPDATE -------------------------
  useEffect(() => {
    console.log("UPDATING");

    let timeoutId;

    const handleResize = () => {
      timeoutId = setTimeout(() => {
        if (window.innerWidth <= preferredSlideWidth) {
          setSlideWidth(window.innerWidth);
        } else if (slideWidth !== preferredSlideWidth) {
          setSlideWidth(preferredSlideWidth);
        }
      }, 500);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      handleRelease();
    };
  }, [preferredSlideWidth]);

  return (
    <div
      className={`main-container ${animationsOff ? "disable-animations" : ""}`}
    >
      <div
        className="carousel-container"
        onMouseDown={swipeEnabled ? handleClick : null}
        onMouseUp={swipeEnabled ? handleRelease : null}
      >
        <div className="slides-container" style={slidesContainerStyle}>
          {slides.map((slide, index) => (
            <div
              className={`slide ${slices[index] === 0 ? "active" : ""}`}
              key={index}
              style={
                slices[index] === 0
                  ? activeSlideStyle(index)
                  : slideStyle(index)
              }
            >
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
        <div className="minimap">
          {slices.map((slice, index) => (
            <div
              className={`dot ${slice === 0 ? "active" : ""}`}
              onClick={() => jumpToSlide(index)}
            />
          ))}
        </div>
      </div>

      <p style={{ marginTop: "50px" }}>
        slices:
        <b>[{slices.map(slice => `${slice >= 0 ? " " : ""}${slice},`)}]</b>
      </p>

      <div
        className="properties-controls"
        onMouseDown={toggleAnimations}
        onMouseUp={toggleAnimations}
      >
        <Slider
          value={preferredSlideWidth}
          handleInputChange={setPreferredSlideWidth}
          label={"preferredSlideWidth"}
        />
        <Slider
          value={slideWidth}
          handleInputChange={setSlideWidth}
          label={"slideWidth"}
        />
        <Slider
          value={slideHeight}
          handleInputChange={setSlideHeight}
          max={1000}
          label={"slideHeight"}
        />
        <Slider
          value={numberOfSlides}
          handleInputChange={setNumberOfSlides}
          max={100}
          label={"numberOfSlides"}
        />
        <Slider
          value={distanceBetweenSlides}
          handleInputChange={setDistanceBetweenSlides}
          max={20}
          label={"distanceBetweenSlides"}
        />
        <Slider
          value={carouselWidth}
          handleInputChange={setCarouselWidth}
          max={1000}
          label={"carouselWidth"}
        />
      </div>
    </div>
  );
};

export default Carousel;
