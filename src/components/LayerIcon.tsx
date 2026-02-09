import { LayerType } from "@/lib/types";

interface LayerIconProps {
  type: LayerType;
  className?: string;
}

/**
 * Renders the appropriate icon for each Figma layer type.
 * Uses inline SVGs for pixel-perfect control at 16px.
 */
export function LayerIcon({ type, className = "" }: LayerIconProps) {
  const size = 16;
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    className,
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (type) {
    case "FRAME":
      return (
        <svg {...svgProps}>
          {/* Frame icon: hash/grid pattern */}
          <path
            d="M3 5.5h10M3 10.5h10M5.5 3v10M10.5 3v10"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );

    case "GROUP":
      return (
        <svg {...svgProps}>
          {/* Group icon: overlapping rectangles */}
          <rect
            x="2"
            y="4"
            width="8"
            height="8"
            rx="1"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="6"
            y="2"
            width="8"
            height="8"
            rx="1"
            stroke="currentColor"
            strokeWidth="1"
            fill="var(--color-figma-bg)"
          />
        </svg>
      );

    case "TEXT":
      return (
        <svg {...svgProps}>
          {/* Text icon: letter T */}
          <path
            d="M4 4h8M8 4v9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "RECTANGLE":
      return (
        <svg {...svgProps}>
          <rect
            x="2.5"
            y="3.5"
            width="11"
            height="9"
            rx="1"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      );

    case "ELLIPSE":
      return (
        <svg {...svgProps}>
          <ellipse
            cx="8"
            cy="8"
            rx="5.5"
            ry="5.5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      );

    case "COMPONENT":
      return (
        <svg {...svgProps}>
          {/* Component icon: diamond shape (Figma uses purple) */}
          <path
            d="M8 2L13 8L8 14L3 8L8 2Z"
            stroke="#B45AFF"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      );

    case "IMAGE":
      return (
        <svg {...svgProps}>
          {/* Image icon: rectangle with mountain */}
          <rect
            x="2.5"
            y="3.5"
            width="11"
            height="9"
            rx="1"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M2.5 10.5L5.5 7.5L8 10L10.5 7L13.5 10.5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="5" cy="6" r="1" fill="currentColor" />
        </svg>
      );

    default:
      return (
        <svg {...svgProps}>
          <rect
            x="3"
            y="3"
            width="10"
            height="10"
            rx="1"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      );
  }
}
