import React, { useState, useEffect } from "react";
import Carousel3 from "../Carousel4/Carousel4";
import "./css/carousel-container2.css";

class CarouselContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      delta: 0,
      initialPosition: 0,
      currentPosition: 0,
      dragging: false
    };
  }

  componentDidUpdate() {
    console.log(this.state.delta);
  }

  handleDrag = e => {
    console.log(e)
    // if (this.state.initialPosition === 0) {
    //   this.state.initialPosition = e.clientX;
    // } else {
    //   this.state.currentPosition = e.clientX;
    //   this.setState({
    //     delta: this.state.initialPosition - this.state.currentPosition
    //   });
    // }
  };

  handleClick = () => {
    console.log("%c touched ", "background: #000; color: #bada55");
    window.addEventListener("touchmove", this.handleDrag);
    this.setState({ dragging: true });
  };
  handleRelease = () => {
    console.log("%c released ", "background: #000; color: #bada55");
    window.removeEventListener("touchmove", this.handleDrag);
    this.setState({ delta: 0, initialPosition: 0, currentPosition: 0 });
    this.setState({ dragging: false });
  };

  render() {
    return (
      <div
        class="test"
        onTouchStart={this.handleClick}
        onTouchEnd={this.handleRelease}
      >
        <Carousel3 />
      </div>
    );
  }
}

export default CarouselContainer;
