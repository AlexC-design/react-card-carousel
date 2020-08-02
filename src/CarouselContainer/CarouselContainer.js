import React, { useState, useEffect } from "react";
import Carousel3 from "../Carousel3/Carousel3";
import "./css/carousel-container.css";

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

  handleDrag = e => {
    if (this.state.initialPosition === 0) {
      this.state.initialPosition = e.clientX;
    } else {
      this.state.currentPosition = e.clientX;
      this.setState({
        delta: this.state.initialPosition - this.state.currentPosition
      });
    }
  };


  handleClick = () => {
    console.log("%c touched ", "background: #000; color: #bada55");
    window.addEventListener("mousemove", this.handleDrag);
    this.setState({ dragging: true });
  };
  handleRelease = () => {
    console.log("%c released ", "background: #000; color: #bada55");
    window.removeEventListener("mousemove", this.handleDrag);
    this.setState({ delta: 0, initialPosition: 0, currentPosition: 0 });
    this.setState({ dragging: false });
  };

  render() {
    return (
      <div onMouseDown={this.handleClick} onMouseUp={this.handleRelease}>
        <Carousel3
          delta={this.state.delta}
          dragging={this.state.dragging}
          initialPosition={this.state.initialPosition}
          currentPosition={this.state.currentPosition}
        />
      </div>
    );
  }
}

export default CarouselContainer;
