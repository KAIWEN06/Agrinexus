import leaf from "../../../assets/images/leaf.svg";

export default function Leaf({
  size,
  opacity,
  blur,
  zIndex,
  innerRef,
}) {
  return (
    <img
      ref={innerRef}
      src={leaf}
      alt=""
      draggable={false}
      className="
        absolute
        select-none
        pointer-events-none
        will-change-transform
      "
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        zIndex,
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
        filter: `
          blur(${blur}px)
          drop-shadow(0 8px 16px rgba(0,0,0,.08))
        `,
      }}
    />
  );
}