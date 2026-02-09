import { Layer, isContainer } from "./types";

/**
 * Given a flat sorted array of layers and a set of expanded IDs,
 * returns only the layers that should be visible in the panel.
 *
 * A layer is visible if all its ancestors are expanded.
 */
export function getVisibleLayers(
  allLayers: Layer[],
  expandedIds: Set<string>
): Layer[] {
  // Build a map of id -> layer for quick lookup
  const layerMap = new Map<string, Layer>();
  for (const layer of allLayers) {
    layerMap.set(layer.id, layer);
  }

  return allLayers.filter((layer) => {
    // Root layers (no parent) are always visible
    if (!layer.parentId) return true;

    // Walk up the tree — every ancestor must be expanded
    let currentParentId: string | null = layer.parentId;
    while (currentParentId) {
      if (!expandedIds.has(currentParentId)) return false;
      const parent = layerMap.get(currentParentId);
      currentParentId = parent?.parentId ?? null;
    }
    return true;
  });
}

/**
 * Check if a layer has any children in the flat list.
 */
export function hasChildren(layer: Layer, allLayers: Layer[]): boolean {
  if (!isContainer(layer.type)) return false;
  return allLayers.some((l) => l.parentId === layer.id);
}

/**
 * Get all descendant IDs of a layer.
 */
export function getDescendantIds(
  layerId: string,
  allLayers: Layer[]
): string[] {
  const descendants: string[] = [];
  const stack = [layerId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const children = allLayers.filter((l) => l.parentId === currentId);
    for (const child of children) {
      descendants.push(child.id);
      stack.push(child.id);
    }
  }

  return descendants;
}
