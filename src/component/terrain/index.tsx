import * as THREE from "three";
import { useBox } from "@react-three/cannon";
import Materials, { MaterialType } from './mesh/materials'
import { InstancedMesh } from "three";
import { useEffect, useRef } from "react";
import Worker from './worker?worker'

export const Terrain = () => {
  const [ref, api] = useBox<InstancedMesh>(() => {
    return {
      type: "Static"
    }
  })
  // useEffect(() => {
  // for (let i = 0; i < 100; i++) {
  //   api.at(i).position.set(i, i, i)
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    if (ref.current) {
      ref.current.renderOrder = -1
    }
    // const generate = new Worker()
    // generate.postMessage({
    //   bedrockSize: 50
    // })

    // generate.onmessage = (msg: MessageEvent<{
    //   heightArr: number[]
    // }>) => {
    //   let index = 0
    //   for (let x = 0; x < 5; x++) {
    //     for (let y = 0; y < 5; y++) {
    //       api.at(index).position.set(x, 1, y)
    //       index += 1;
    //     }
    //   }
    // }
    let index = 0;
  for (let i = 0; i < 10; i ++) {
    for (let j = 0; j < 10; j ++) {
      api.at(index).position.set(i, 0, j)
      index += 1;
    }
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