"use server";

import { prisma } from "@/lib/db";

export async function updateLayerVisibility(id: string, visible: boolean) {
  await prisma.layer.update({
    where: { id },
    data: { visible },
  });
}

export async function updateLayerLock(id: string, locked: boolean) {
  await prisma.layer.update({
    where: { id },
    data: { locked },
  });
}

export async function updateLayerName(id: string, name: string) {
  await prisma.layer.update({
    where: { id },
    data: { name },
  });
}

export async function updateLayerExpanded(id: string, expanded: boolean) {
  await prisma.layer.update({
    where: { id },
    data: { expanded },
  });
}
