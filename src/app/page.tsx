import { prisma } from "@/lib/db";
import { LayersPanel } from "@/components/LayersPanel";
import { Layer } from "@/lib/types";

export default async function Home() {
  const dbLayers = await prisma.layer.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // Map Prisma types to our app types
  const layers: Layer[] = dbLayers.map((l) => ({
    id: l.id,
    name: l.name,
    type: l.type as Layer["type"],
    parentId: l.parentId,
    depth: l.depth,
    sortOrder: l.sortOrder,
    visible: l.visible,
    locked: l.locked,
    expanded: l.expanded,
  }));

  return (
    <main className="flex min-h-screen bg-[#2c2c2c]">
      <LayersPanel initialLayers={layers} />

      {/* Canvas placeholder — shows this is a sidebar panel */}
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-figma-text-secondary">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="mx-auto mb-4 opacity-30"
          >
            <rect
              x="4"
              y="4"
              width="40"
              height="40"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M16 24h16M24 16v16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm opacity-50">Canvas Area</p>
        </div>
      </div>
    </main>
  );
}
