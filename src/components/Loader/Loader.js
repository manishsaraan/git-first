import React from "react";
import "./Loader.css";

const Loader = () => (
  <div id="wave">
    <span className="dot" />
    <span className="dot" />
    <span className="dot" />
    <span style={{ display: 'flex' }}>Fetching Repostories</span>
  </div>
);

export default Loader;
