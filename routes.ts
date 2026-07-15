import { fileDocsMeta } from "@/resource/docs_demo/generated/files-meta-docs";

export type FileDocMeta = (typeof fileDocsMeta)[1];

export interface MetaDocsRoute {
  group: string;
  data: FileDocMeta[];
}
export type NestedMetaDocsRoute = {
  group: string;
  data: MetaDocsRoute[];
};

export function generatedMetaDocsRouteZZ(data: FileDocMeta[], order: readonly string[]): MetaDocsRoute[] {
  const groupMap: Record<string, FileDocMeta[]> = {};

  for (const item of data) {
    const group = item.segment[1];
    (groupMap[group] ||= []).push(item);
  }

  return order.filter(group => groupMap[group]?.length).map(group => ({ group, data: groupMap[group] }));
}

export function generatedMetaDocsRouteXX(data: FileDocMeta[], order: readonly string[]): MetaDocsRoute[] {
  const groupMap: Record<string, FileDocMeta[]> = {};

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const group = item.segment[1];
    if (groupMap[group]) {
      groupMap[group].push(item);
    } else {
      groupMap[group] = [item];
    }
  }

  const result: MetaDocsRoute[] = [];

  for (let i = 0; i < order.length; i++) {
    const group = order[i];
    const groupData = groupMap[group];
    if (groupData) {
      result.push({ group, data: groupData });
    }
  }

  return result;
}

export function generatedMetaDocsRoute(data: FileDocMeta[], order: readonly string[]): MetaDocsRoute[] {
  // Pre-allocate array with known order length
  const result = new Array<MetaDocsRoute>(order.length);
  const groupMap: { [group: string]: FileDocMeta[] } = Object.create(null);

  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i];
    const group = item.segment[1];
    if (!groupMap[group]) {
      groupMap[group] = [];
    }
    groupMap[group].push(item);
  }

  for (let i = 0, len = order.length; i < len; i++) {
    const group = order[i];
    const groupData = groupMap[group];
    result[i] = { group, data: groupData || [] }; // fallback to empty array if missing
  }

  return result;
}

const customOrder = ["configuration", "utilities", "components", "hooks"] as const;

export const metaDocsRoute = generatedMetaDocsRoute(fileDocsMeta, customOrder);

export const restRoutes = {
  configuration: generatedMetaDocsRoute(fileDocsMeta, ["configuration"]),
  utilities: generatedMetaDocsRoute(fileDocsMeta, ["utilities"]),
  components: generatedMetaDocsRoute(fileDocsMeta, ["components"]),
  hooks: generatedMetaDocsRoute(fileDocsMeta, ["hooks"])
};

/*
import { benchmark } from "./source/test-benchmark";
benchmark(() => {
  generatedMetaDocsRoute(fileDocsMeta, customOrder);
  generatedMetaDocsRoute(fileDocsMeta, customOrder);
  generatedMetaDocsRoute(fileDocsMeta, customOrder);
  generatedMetaDocsRoute(fileDocsMeta, customOrder);
  generatedMetaDocsRoute(fileDocsMeta, customOrder);
}, "generatedMetaDocsRoute");
*/
