import { cn } from "@/lib/cn";

interface PanelHeaderProps {
  onCollapseAll: () => void;
}

export function PanelHeader({ onCollapseAll }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-between",
        "border-b border-figma-border px-3"
      )}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-figma-text-secondary">
        Layers
      </span>
      <button
        onClick={onCollapseAll}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded",
          "text-figma-icon hover:bg-figma-bg-hover hover:text-figma-icon-hover",
          "transition-colors"
        )}
        title="Collapse all layers"
        aria-label="Collapse all layers"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 10L8 6L12 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
