import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import Leaf from "./Leaf";

/* ===========================================
   CONFIG
=========================================== */

const LEAF_COUNT = 14;
const MOUSE_RADIUS = 160;
const MAX_SWAY = 18;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomBool() {
  return Math.random() > 0.5;
}

export default function FloatingLeaves() {
  const containerRef = useRef(null);

  const leafRefs = useRef([]);

  const mouse = useRef({
    x: -9999,
    y: -9999,
  });

  const viewport = useRef({
    width: 0,
    height: 0,
  });

  const wind = useRef({
    strength: 0,
    direction: 1,
  });

  const leaves = useMemo(() => {
    return Array.from(
      { length: LEAF_COUNT },
      (_, index) => ({
        id: index,

        /* Position */

        x: 0,
        y: 0,

        /* Appearance */

        size: random(22, 42),

        opacity: random(0.12, 0.24),

        blur: random(0, 0.5),

        zIndex: randomBool()
          ? 12
          : 14,

        /* Movement */

        speed: random(0.45, 1.1),

        sway: random(
          0,
          Math.PI * 2
        ),

        swaySpeed: random(
          0.008,
          0.025
        ),

        rotation: random(
          0,
          360
        ),

        rotateSpeed: random(
          -0.45,
          0.45
        ),

        /* Runtime */

        drawX: 0,

        drawY: 0,

        targetX: 0,

        targetY: 0,

        scale: 1,
      })
    );
  }, []);

  /* ===========================================
     ENGINE
  =========================================== */

  useEffect(() => {
    if (!containerRef.current) return;

    const updateViewport = () => {
      viewport.current.width =
        containerRef.current.offsetWidth;

      viewport.current.height =
        containerRef.current.offsetHeight;
    };

    updateViewport();

    leaves.forEach((leaf) => {
      leaf.x = random(
        0,
        viewport.current.width
      );

      leaf.y = random(
        -viewport.current.height,
        viewport.current.height
      );
    });

    const handleMouseMove = (event) => {
      const rect =
        containerRef.current.getBoundingClientRect();

      mouse.current.x =
        event.clientX - rect.left;

      mouse.current.y =
        event.clientY - rect.top;
    };

    window.addEventListener(
      "resize",
      updateViewport
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    let frame;

    const animate = () => {
              wind.current.strength =
        Math.sin(Date.now() / 6000) * 0.35;

      leaves.forEach((leaf, index) => {

        /* Falling */

        leaf.y +=
          leaf.speed +
          leaf.size * 0.01;

        /* Wind */

        leaf.x +=
          wind.current.strength;

        /* Swing */

        leaf.sway +=
          leaf.swaySpeed;

        /* Rotation */

        leaf.rotation +=
          leaf.rotateSpeed;

        /* Natural Position */

        leaf.drawX =
          leaf.x +
          Math.sin(leaf.sway) *
          MAX_SWAY;

        leaf.drawY =
          leaf.y;

        leaf.scale = 1;

        /* Mouse Physics */

        const dx =
          leaf.drawX -
          mouse.current.x;

        const dy =
          leaf.drawY -
          mouse.current.y;

        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          );

        if (
          distance < MOUSE_RADIUS &&
          distance > 0
        ) {

          const force =
            (MOUSE_RADIUS - distance) /
            MOUSE_RADIUS;

          leaf.targetX =
            leaf.drawX +
            (dx / distance) *
            force *
            45;

          leaf.targetY =
            leaf.drawY +
            (dy / distance) *
            force *
            45;

          leaf.scale =
            1 +
            force * 0.12;

        }

        if (
          leaf.targetX === 0
        ) {

          leaf.targetX =
            leaf.drawX;

          leaf.targetY =
            leaf.drawY;

        }

        /* Smooth Return */

        leaf.drawX +=
          (leaf.targetX - leaf.drawX) *
          0.08;

        leaf.drawY +=
          (leaf.targetY - leaf.drawY) *
          0.08;

        leaf.targetX +=
          (leaf.x - leaf.targetX) *
          0.05;

        leaf.targetY +=
          (leaf.y - leaf.targetY) *
          0.05;

        /* Respawn */

        if (
          leaf.y >
          viewport.current.height + 80
        ) {

          leaf.y =
            random(-180, -40);

          if (
            Math.random() < 0.7
          ) {

            leaf.x = random(
              viewport.current.width * 0.2,
              viewport.current.width * 0.8
            );

          } else {

            leaf.x =
              Math.random() > 0.5
                ? random(
                    0,
                    viewport.current.width * 0.15
                  )
                : random(
                    viewport.current.width * 0.85,
                    viewport.current.width
                  );

          }

        }

        const element =
          leafRefs.current[index];

        if (!element) return;

        element.style.transform = `
          translate3d(
            ${leaf.drawX}px,
            ${leaf.drawY}px,
            0
          )
          rotate(${leaf.rotation}deg)
          scale(${leaf.scale})
        `;

      });

      frame =
        requestAnimationFrame(
          animate
        );

    };

    animate();

    return () => {

      cancelAnimationFrame(frame);

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "resize",
        updateViewport
      );

    };

  }, [leaves]);

  return (

    <div
      ref={containerRef}
      className="
        absolute
        inset-0
        z-10
        overflow-hidden
        pointer-events-none
      "
    >

      {leaves.map((leaf, index) => (

        <Leaf
          key={leaf.id}
          innerRef={(element) =>
            (leafRefs.current[index] = element)
          }
          size={leaf.size}
          opacity={leaf.opacity}
          blur={leaf.blur}
          zIndex={leaf.zIndex}
        />

      ))}

    </div>

  );

}