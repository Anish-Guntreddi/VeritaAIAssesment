import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedLayer {
  name: string;
  type: string;
  children?: SeedLayer[];
}

const layerTree: SeedLayer[] = [
  {
    name: "Page 1",
    type: "FRAME",
    children: [
      {
        name: "Header",
        type: "FRAME",
        children: [
          { name: "Logo", type: "RECTANGLE" },
          {
            name: "Nav Links",
            type: "GROUP",
            children: [
              { name: "Home", type: "TEXT" },
              { name: "About", type: "TEXT" },
              { name: "Contact", type: "TEXT" },
            ],
          },
          { name: "Avatar", type: "ELLIPSE" },
        ],
      },
      {
        name: "Hero Section",
        type: "FRAME",
        children: [
          { name: "Heading", type: "TEXT" },
          { name: "Subheading", type: "TEXT" },
          { name: "CTA Button", type: "COMPONENT" },
        ],
      },
      {
        name: "Features",
        type: "FRAME",
        children: [
          { name: "Feature Card 1", type: "FRAME" },
          { name: "Feature Card 2", type: "FRAME" },
        ],
      },
      { name: "Footer", type: "FRAME" },
    ],
  },
];

let sortCounter = 0;

async function createLayers(
  layers: SeedLayer[],
  parentId: string | null,
  depth: number
) {
  for (const layer of layers) {
    const order = sortCounter++;
    const created = await prisma.layer.create({
      data: {
        name: layer.name,
        type: layer.type,
        parentId,
        depth,
        sortOrder: order,
        visible: true,
        locked: false,
        expanded: depth < 2,
      },
    });

    if (layer.children) {
      await createLayers(layer.children, created.id, depth + 1);
    }
  }
}

async function main() {
  await prisma.layer.deleteMany();
  sortCounter = 0;
  await createLayers(layerTree, null, 0);
  const count = await prisma.layer.count();
  console.log(`Seeded ${count} layers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
