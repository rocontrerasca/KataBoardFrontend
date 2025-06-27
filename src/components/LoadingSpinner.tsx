import React from "react";

const spinnerStyle: React.CSSProperties = {
  width: "60px",
  height: "60px",
  border: "6px solid #f3f3f3",
  borderTop: "6px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const LoadingSpinner = () => (
  <div style={overlayStyle}>
    <div style={spinnerStyle} />
  </div>
);

export default LoadingSpinner;
