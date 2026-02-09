export type LayerType =
  | "FRAME"
  | "GROUP"
  | "TEXT"
  | "RECTANGLE"
  | "ELLIPSE"
  | "COMPONENT"
  | "IMAGE";

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  parentId: string | null;
  depth: number;
  sortOrder: number;
  visible: boolean;
  locked: boolean;
  expanded: boolean;
}

/** Layer types that can contain children */
export const CONTAINER_TYPES: LayerType[] = ["FRAME", "GROUP", "COMPONENT"];

export function isContainer(type: LayerType): boolean {
  return CONTAINER_TYPES.includes(type);
}
