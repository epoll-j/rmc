import { create } from "zustand";

interface BlockStore {
  blockMap: Map<string, number>;
  setBlockMap: (map: Map<string, number>) => void;
}

export const useBlocks = create<BlockStore>((set) => ({
  blockMap: new Map<string, number>(),
  setBlockMap(map) {
    set(() => ({blockMap: map}))
    console.log(map)
  },
}));
