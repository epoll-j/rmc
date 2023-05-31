import * as THREE from "three";
import { useBox } from "@react-three/cannon";
import Materials, { MaterialType } from './mesh/materials'
import { InstancedMesh } from "three";
import { useEffect, useRef } from "react";

export const Terrain = () => {
  const [ref, api] = useBox<InstancedMesh>(() => {
    return {
      type: "Static"
    }
  })
  useEffect(() => {
    for (let i = 0; i < 100; i++) {
      api.at(i).position.set(i, i, i)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const materials = new Materials()

  return (
    <>
      <instancedMesh ref={ref} args={[boxGeometry, materials.get(MaterialType.grass), 100]}>
      </instancedMesh>
    </>
  )
}