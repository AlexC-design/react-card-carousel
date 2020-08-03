import React from "react";
import "./css/slider.css";

const Slider = ({ value, handleInputChange, label, min, max }) => {
  return (
    <div className="control-container">
      <p className="control-label">{label}</p>
      <div className="controls">
        <input
          className="control-slider"
          type="range"
          min={min || 1}
          max={max || 2000}
          value={value}
          id="myRange"
          onChange={e => handleInputChange(e.target.value)}
        />
        <input
          className="control-input"
          type="number"
          value={value}
          onChange={e => handleInputChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Slider;
