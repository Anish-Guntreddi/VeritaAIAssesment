"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Layer } from "@/lib/types";
import { getVisibleLayers, hasChildren as checkHasChildren } from "@/lib/layer-utils";
import { PanelHeader } from "./PanelHeader";
import { LayerRow } from "./LayerRow";
import { updateLayerVisibility, updateLayerLock, updateLayerName, updateLayerExpanded } from "@/app/actions";

interface LayersPanelProps {
  initialLayers: Layer[];
}

export function LayersPanel({ initialLayers }: LayersPanelProps) {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Initialize from DB expanded state
    const expanded = new Set<string>();
    for (const layer of initialLayers) {
      if (layer.expanded) expanded.add(layer.id);
    }
    return expanded;
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const visibleLayers = getVisibleLayers(layers, expandedIds);

  // ── Selection ──────────────────────────────────────────────
  const handleSelect = useCallback(
    (id: string, e: React.MouseEvent) => {
      const clickedIndex = visibleLayers.findIndex((l) => l.id === id);

      if (e.metaKey || e.ctrlKey) {
        // Cmd/Ctrl+click: toggle individual selection
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
      } else if (e.shiftKey && lastSelectedId) {
        // Shift+click: range selection
        const lastIndex = visibleLayers.findIndex(
          (l) => l.id === lastSelectedId
        );
        if (lastIndex !== -1 && clickedIndex !== -1) {
          const start = Math.min(lastIndex, clickedIndex);
          const end = Math.max(lastIndex, clickedIndex);
          const rangeIds = visibleLayers
            .slice(start, end + 1)
            .map((l) => l.id);
          setSelectedIds(new Set(rangeIds));
        }
      } else {
        // Normal click: single selection
        setSelectedIds(new Set([id]));
      }

      setLastSelectedId(id);
      setFocusedIndex(clickedIndex);
    },
    [visibleLayers, lastSelectedId]
  );

  // ── Expand/Collapse ────────────────────────────────────────
  const handleToggleExpand = useCallback((id: string) => {
    const willExpand = !expandedIds.has(id);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (willExpand) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
    updateLayerExpanded(id, willExpand);
  }, [expandedIds]);

  const handleCollapseAll = useCallback(() => {
    // Persist all currently expanded layers as collapsed
    expandedIds.forEach((id) => updateLayerExpanded(id, false));
    setExpandedIds(new Set());
  }, [expandedIds]);

  // ── Visibility Toggle ──────────────────────────────────────
  const handleToggleVisibility = useCallback(
    (id: string) => {
      setLayers((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, visible: !l.visible } : l
        )
      );
      const layer = layers.find((l) => l.id === id);
      if (layer) {
        updateLayerVisibility(id, !layer.visible);
      }
    },
    [layers]
  );

  // ── Lock Toggle ────────────────────────────────────────────
  const handleToggleLock = useCallback(
    (id: string) => {
      setLayers((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, locked: !l.locked } : l
        )
      );
      const layer = layers.find((l) => l.id === id);
      if (layer) {
        updateLayerLock(id, !layer.locked);
      }
    },
    [layers]
  );

  // ── Rename ─────────────────────────────────────────────────
  const handleStartRename = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleFinishRename = useCallback(
    (id: string, newName: string) => {
      const trimmed = newName.trim();
      if (trimmed) {
        setLayers((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, name: trimmed } : l
          )
        );
        updateLayerName(id, trimmed);
      }
      setEditingId(null);
    },
    []
  );

  const handleCancelRename = useCallback(() => {
    setEditingId(null);
  }, []);

  // ── Keyboard Navigation ────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if panel is focused
      if (!panelRef.current?.contains(document.activeElement) &&
          document.activeElement !== panelRef.current) {
        return;
      }

      // Don't handle keys when editing
      if (editingId) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = Math.min(
            focusedIndex + 1,
            visibleLayers.length - 1
          );
          setFocusedIndex(nextIndex);
          const nextLayer = visibleLayers[nextIndex];
          if (nextLayer && !e.shiftKey) {
            setSelectedIds(new Set([nextLayer.id]));
            setLastSelectedId(nextLayer.id);
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prevIndex);
          const prevLayer = visibleLayers[prevIndex];
          if (prevLayer && !e.shiftKey) {
            setSelectedIds(new Set([prevLayer.id]));
            setLastSelectedId(prevLayer.id);
          }
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const focusedLayer = visibleLayers[focusedIndex];
          if (focusedLayer && checkHasChildren(focusedLayer, layers)) {
            if (!expandedIds.has(focusedLayer.id)) {
              handleToggleExpand(focusedLayer.id);
            }
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          const currentLayer = visibleLayers[focusedIndex];
          if (currentLayer && expandedIds.has(currentLayer.id)) {
            handleToggleExpand(currentLayer.id);
          }
          break;
        }
        case "F2": {
          e.preventDefault();
          const layerToRename = visibleLayers[focusedIndex];
          if (layerToRename) {
            handleStartRename(layerToRename.id);
          }
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    focusedIndex,
    visibleLayers,
    layers,
    expandedIds,
    editingId,
    handleToggleExpand,
    handleStartRename,
  ]);

  return (
    <div
      ref={panelRef}
      className="flex h-screen w-[280px] flex-col bg-figma-bg border-r border-figma-border outline-none"
      tabIndex={0}
      role="tree"
      aria-label="Layers panel"
    >
      <PanelHeader onCollapseAll={handleCollapseAll} />

      <div className="flex-1 overflow-y-auto py-1">
        {visibleLayers.map((layer, index) => (
          <LayerRow
            key={layer.id}
            layer={layer}
            isSelected={selectedIds.has(layer.id)}
            isExpanded={expandedIds.has(layer.id)}
            hasChildren={checkHasChildren(layer, layers)}
            isFocused={focusedIndex === index}
            editingId={editingId}
            onSelect={handleSelect}
            onToggleExpand={handleToggleExpand}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onStartRename={handleStartRename}
            onFinishRename={handleFinishRename}
            onCancelRename={handleCancelRename}
          />
        ))}
      </div>
    </div>
  );
}
