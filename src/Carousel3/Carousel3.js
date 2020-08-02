import React, { useState, useEffect, useRef } from "react";
import "./css/carousel3.css";

const Carousel = ({ delta, dragging, initialPosition, currentPosition }) => {
  const [slideHeight, setSlideHeight] = useState(400);
  const [slideWidth, setSlideWitdh] = useState(0);
  const [preferredSlideWidth, setPreferredSlideWitdh] = useState(150);
  const [carouselWidth, setCarouselWidth] = useState(800);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [slices, setSlices] = useState([]);
  const [slicePercentage, setSlicePercentage] = useState({ left: 1, right: 1 });
  const [slidePadding, setSlidePadding] = useState(0.95);
  const [positionsMoved, setPositionsMoved] = useState(0);
  const [individualSlideMoved, setIndividualSlideMoved] = useState(0);
  const [updated, setUpdated] = useState(false);
  const [distanceBetweenSlides, setDistanceBetweenSlides] = useState(0);

  const firstSlide = useRef(null);
  const secondSlide = useRef(null);

  const slides = new Array(5).fill("test");

  // ------------------------- INDEX TO VALUES -------------------------
  const indexToPosition = index => {
    return (
      50 +
      slices[index] *
        (slicePercentage[slices[index] < 0 ? "left" : "right"])
    );
  };

  // ------------------------- STYLES -------------------------
  const slideStyle = index => {
    return {
      height: `${slideHeight}px`,
      width: `${slideWidth}px`,
      zIndex: 1,
      left: dragging
        ? `calc(${indexToPosition(index)}% - ${individualSlideMoved}px)`
        : `${indexToPosition(index)}%`,
      opacity: 1,
      transition: dragging ? "none" : `all 0.2s ease-out`
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

  const nextSlide = () => {
    let slicesArray = [...slices];
    setSlices([slicesArray.pop()].concat(slicesArray));

    if (activeSlideIndex === slides.length - 1) {
      setActiveSlideIndex(0);
    } else {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };
  const prevSlide = () => {
    let slicesArray = [...slices];
    setSlices(slicesArray.concat(slicesArray.shift()));

    if (activeSlideIndex === 0) {
      setActiveSlideIndex(slides.length - 1);
    } else {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
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
    setDistanceBetweenSlides(
      secondSlide.current.getBoundingClientRect().x -
        firstSlide.current.getBoundingClientRect().x
    );
    console.log(" - indiv slide moved:", individualSlideMoved);
    console.log(" - positions moved:", positionsMoved);
    console.log(" ");

    setIndividualSlideMoved(
      delta - Math.abs(positionsMoved) * distanceBetweenSlides
    );

    if (
      delta + Math.abs(positionsMoved) * distanceBetweenSlides <
      -distanceBetweenSlides
    ) {
      prevSlide();
      setPositionsMoved(positionsMoved - 1);
      setUpdated(true);
    } else if (
      delta - Math.abs(positionsMoved) * distanceBetweenSlides >
      distanceBetweenSlides
    ) {
      nextSlide();
      setPositionsMoved(positionsMoved + 1);
      setUpdated(true);
    }

    return () => {
      if (!dragging) {
        setPositionsMoved(0);
        setIndividualSlideMoved(0);
        setUpdated(false);
      }
      // handleRelease();
    };
  });

  // ------------------------- HNANDLING RESIZE --------------------------

  useEffect(() => {
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
    <div
      className="main-container"
      // onMouseDown={handleClick}
      // onMouseUp={handleRelease}
    >
      <div className="carousel-container">
        <div className="slides-container" style={slidesContainerStyle}>
          {slides.map((slide, index) => (
            <div
              className="slide"
              key={index}
              style={slideStyle(index)}
              ref={index === 0 ? firstSlide : index === 1 ? secondSlide : null}
            >
              <div className="slide-content">
                <div className="cover" />
                <p>{index}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p>
        {`(${
          delta - Math.abs(positionsMoved) * distanceBetweenSlides
        }) ${delta} - ${Math.abs(positionsMoved)} * ${distanceBetweenSlides} <
      -${distanceBetweenSlides}`}
      </p>
      <p>
        delta: <b>{delta} </b>
      </p>

      <p>
        individualSlideMoved: <b>{individualSlideMoved}px </b>
      </p>
      <p>
        positionsMoved: <b>{positionsMoved} </b>
      </p>
      <p>
        initialPosition: <b>{initialPosition} </b>
      </p>
      <p>
        currentPosition: <b>{currentPosition} </b>
      </p>
      <p>
        distanceBetweenSlides: <b>{distanceBetweenSlides}px</b>
      </p>
      <p>
        slideWidth: <b>{slideWidth}px</b>
      </p>
      <p>
        slides:
        <b>[{slides.map((_, index) => ` ${index},`)}]</b>
      </p>
      <p>
        slices:
        <b>[{slices.map(slice => `${slice >= 0 ? " " : ""}${slice},`)}]</b>
      </p>
    </div>
  );
};

export default Carousel;
