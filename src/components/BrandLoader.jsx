import React from "react";
import { brand } from "../brand";

export const BrandLoader = ({ label = "Preparing your experience...", fullscreen = false }) => {
  return (
    <div className={`haleel-loader-wrap ${fullscreen ? "haleel-loader-fullscreen" : ""}`}>
      <div className="haleel-loader-aura" />
      <div className="haleel-loader-mark">
        <img src={brand.logo} alt={brand.name} />
      </div>
      <p>{label}</p>
    </div>
  );
};
