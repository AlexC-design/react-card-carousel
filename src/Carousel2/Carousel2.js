import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import './css/carousel2.css';

// ------------------------- INDEX TO VALUES -------------------------
const indexToPosition = (index, slices, slicePercentage) => {
  return (
    50 + slices[index] * slicePercentage[slices[index] < 0 ? 'left' : 'right']
  );
};

const indexToSize = (index, slices) => {
  if (slices && slices.length) {
    const sizeFromIndex = 1 - Math.abs(slices[index]) / 10;
    return sizeFromIndex > 0 ? sizeFromIndex : 0;
  }
  return 1;
};

const indexToOpacity = (index, slices) => {
  return 1;
  return 1 - Math.abs(slices[index]) / 4;
};

const indexToCoverOpacity = (index, slices) => {
  return isNaN(slices[index]) ? 0 : Math.abs(slices[index]) / 10;
  return 0;
};

const indexToZIndex = (index, slides, slices) => {
  console.log({ index, slides, slices });
  return Math.floor(slides.length / 2) - Math.abs(slices[index]);
};

// ------------------------- STYLES -------------------------

const slideStyle = ({ index, slides, slices, slicePercentage, slideHeight, slideWidth }) => ({
  height: `${slideHeight}px`,
  width: `${slideWidth}px`,
  zIndex: indexToZIndex(index, slides, slices),
  left: `${indexToPosition(index, slices, slicePercentage)}%`,
  opacity: indexToOpacity(index, slices),
  transform: `scale(${indexToSize(index, slices)})`
});

const coverStyle = (index, slices) => ({
  opacity: indexToCoverOpacity(index, slices)
});

const Slide = props => {
  const { index, slices, slides, slideWidth } = props;

  const [{ slideX, slideY, slideZ, slidePosition }, setSlideData] = useSpring(() => ({
    slideX: 0,
    slideY: 0,
    slideZ: indexToZIndex(index, slides, slices),
    slidePosition: 'static'
  }));
  const bind = useDrag(({ down, movement: [mx, my] }) => setSlideData({
    slideX: down ? mx : 0,
    slideY: down ? my : 0,
    slideZ: down ? 10000 : indexToZIndex(index, slides, slices),
    slidePosition: down ? 'absolute' : 'static'
  }));

  return (
    <animated.div key={index} {...bind()} style={{ x: slideX, y: slideY, zIndex: slideZ, position: slidePosition }}>
      <div
        className="slide"
        style={slideStyle(props)}
      >
        <div className="slide-content">
          <div className="cover" style={coverStyle(index, slices)}/>
          <p>{index}</p>
          <p>{slideWidth}px</p>
        </div>
      </div>
    </animated.div>
  );
};

const Carousel = () => {
  const [slideHeight, setSlideHeight] = useState(500);
  const [slideWidth, setSlideWitdh] = useState(0);
  const [preferredSlideWidth, setPreferredSlideWitdh] = useState(500);
  const [carouselWidth, setCarouselWidth] = useState(900);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [controlDisabled, setControlDisabled] = useState('none');
  const [slices, setSlices] = useState([]);
  const [slicePercentage, setSlicePercentage] = useState({ left: 1, right: 1 });
  const [slidePadding, setSlidePadding] = useState(0.95);

  const slides = new Array(5).fill('test');

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
      setControlDisabled('none');
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
    disableControl('right');
  };
  const prevSlide = () => {
    let slicesArray = [...slices];
    setSlices(slicesArray.concat(slicesArray.shift()));

    if (activeSlideIndex === 0) {
      setActiveSlideIndex(slides.length - 1);
    } else {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
    disableControl('left');
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
    window.addEventListener('resize', () => {
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
    <>
      <div className="main-container">
        <div className="carousel-container">
          <div className="slides-container" style={slidesContainerStyle}>
            {slides.map((_, index) => <Slide
              key={index}
              index={index}
              slides={slides}
              slices={slices}
              slicePercentage={slicePercentage}
              slideHeight={slideHeight}
              slideWidth={slideWidth}
            />)}
          </div>
        </div>
      </div>
      <div className="carousel-controls">
        <div
          className={`control left ${
            controlDisabled === 'left' ? 'disabled' : ''
          }`}
          onClick={prevSlide}
        />
        <div
          className={`control right ${
            controlDisabled === 'right' ? 'disabled' : ''
          }`}
          onClick={nextSlide}
        />
      </div>
    </>
  );
};

export default Carousel;
