import React from "react";

function Voice_effect() {
  const bars = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 0.15,
  }));

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px", overflow: "hidden" }}>
      <style>
        {`
          @keyframes waveHeight {
            0% { height: 4px; }
            25% { height: 16px; }
            50% { height: 7px; }
            75% { height: 18px; }
            100% { height: 4px; }
          }
          .audio-bar {
            animation: waveHeight 2s ease-in-out infinite;
          }
        `}
      </style>

      {bars.map((bar) => (
        <div
          key={bar.id}
          className="audio-bar"
          style={{
            width: "3px",
            height: "4px",
            background: "white",
            borderRadius: "2px",
            animationDelay: `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default Voice_effect;