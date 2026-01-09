"use client";

export default function NorthDirection() {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 20,
      }}
    >
      <img
        src="/images/right.png"
        alt="North"
        style={{ width: "48px", height: "48px" }}
      />
    </div>
  );
}
