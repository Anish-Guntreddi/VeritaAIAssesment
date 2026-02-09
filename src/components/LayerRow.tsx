"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { Layer } from "@/lib/types";
import { LayerIcon } from "./LayerIcon";
import { isContainer } from "@/lib/types";

interface LayerRowProps {
  layer: Layer;
  isSelected: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  isFocused: boolean;
  editingId: string | null;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onToggleExpand: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onStartRename: (id: string) => void;
  onFinishRename: (id: string, newName: string) => void;
  onCancelRename: () => void;
}

const INDENT_PX = 20;

export function LayerRow({
  layer,
  isSelected,
  isExpanded,
  hasChildren,
  isFocused,
  editingId,
  onSelect,
  onToggleExpand,
  onToggleVisibility,
  onToggleLock,
  onStartRename,
  onFinishRename,
  onCancelRename,
}: LayerRowProps) {
  const isEditing = editingId === layer.id;
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [editValue, setEditValue] = useState(layer.name);

  // Auto-focus and select all text when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Scroll into view when focused via keyboard
  useEffect(() => {
    if (isFocused && rowRef.current) {
      rowRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isFocused]);

  const handleDoubleClick = () => {
    setEditValue(layer.name);
    onStartRename(layer.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent panel keyboard handler from firing
    if (e.key === "Enter") {
      onFinishRename(layer.id, editValue);
    } else if (e.key === "Escape") {
      onCancelRename();
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      onFinishRename(layer.id, editValue);
    }
  };

  const showChevron = isContainer(layer.type) && hasChildren;

  return (
    <div
      ref={rowRef}
      className={cn(
        "group flex h-7 items-center pr-2 cursor-default select-none",
        "transition-colors duration-75",
        // Background states
        !isSelected && "hover:bg-figma-bg-hover",
        isSelected && "bg-figma-bg-selected hover:bg-figma-bg-selected-hover",
        // Focus ring for keyboard nav
        isFocused && !isSelected && "ring-1 ring-inset ring-figma-blue/40"
      )}
      style={{ paddingLeft: `${layer.depth * INDENT_PX + 4}px` }}
      onClick={(e) => onSelect(layer.id, e)}
      onDoubleClick={handleDoubleClick}
      data-layer-id={layer.id}
    >
      {/* Expand/collapse chevron */}
      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
        {showChevron ? (
          <button
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-sm",
              "text-figma-icon hover:text-figma-icon-hover",
              "transition-transform duration-150"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(layer.id);
            }}
            aria-label={isExpanded ? "Collapse layer" : "Expand layer"}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className={cn(
                "transition-transform duration-150",
                isExpanded ? "rotate-90" : "rotate-0"
              )}
            >
              <path
                d="M2 1L6 4L2 7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Layer type icon */}
      <div
        className={cn(
          "mx-1.5 flex-shrink-0",
          layer.visible ? "text-figma-icon" : "text-figma-text-disabled"
        )}
      >
        <LayerIcon type={layer.type} />
      </div>

      {/* Layer name / edit input */}
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={cn(
              "w-full rounded-sm bg-figma-bg-secondary px-1 py-0.5",
              "text-[13px] leading-none text-figma-text",
              "outline-none ring-1 ring-figma-blue"
            )}
          />
        ) : (
          <span
            className={cn(
              "block truncate text-[13px] leading-none",
              layer.visible ? "text-figma-text" : "text-figma-text-disabled"
            )}
          >
            {layer.name}
          </span>
        )}
      </div>

      {/* Right-side action icons (lock + visibility) */}
      <div className="ml-1 flex flex-shrink-0 items-center gap-0.5">
        {/* Lock icon */}
        <button
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-sm",
            "transition-colors",
            // Show on hover, or always if locked
            layer.locked
              ? "text-figma-icon opacity-100"
              : "text-figma-icon opacity-0 group-hover:opacity-100",
            "hover:text-figma-icon-hover"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock(layer.id);
          }}
          aria-label={layer.locked ? "Unlock layer" : "Lock layer"}
        >
          {layer.locked ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <rect
                x="3"
                y="6"
                width="8"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M5 6V4.5C5 3.12 6.12 2 7.5 2h0C8.88 2 10 3.12 10 4.5V6"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle cx="7" cy="9" r="1" fill="currentColor" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <rect
                x="3"
                y="6"
                width="8"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M5 6V4.5C5 3.12 6.12 2 7.5 2h0C8.88 2 10 3.12 10 4.5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Visibility icon */}
        <button
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-sm",
            "transition-colors",
            // Show on hover, or always if hidden
            !layer.visible
              ? "text-figma-icon opacity-100"
              : "text-figma-icon opacity-0 group-hover:opacity-100",
            "hover:text-figma-icon-hover"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(layer.id);
          }}
          aria-label={layer.visible ? "Hide layer" : "Show layer"}
        >
          {layer.visible ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1.5 7C1.5 7 3.5 3 7 3C10.5 3 12.5 7 12.5 7C12.5 7 10.5 11 7 11C3.5 11 1.5 7 1.5 7Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="7"
                cy="7"
                r="2"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1.5 7C1.5 7 3.5 3 7 3C10.5 3 12.5 7 12.5 7C12.5 7 10.5 11 7 11C3.5 11 1.5 7 1.5 7Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="2"
                y1="12"
                x2="12"
                y2="2"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
