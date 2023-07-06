import { useMemo } from "react";
import { Scene } from "three";
import { Octree } from "three/examples/jsm/math/Octree";

export default function useOctree(scene: Scene) {
  const octree = useMemo(() => {
    return new Octree().fromGraphNode(scene);
  }, [scene]);

  return octree;
}
