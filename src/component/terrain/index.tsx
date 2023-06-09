import { RapierRigidBody, InstancedRigidBodies, InstancedRigidBodyProps, RigidBody } from "@react-three/rapier"
import { useEffect, useMemo, useRef, useState } from "react"
import { BoxGeometry } from "three"
import Materials, { MaterialType } from "./mesh/materials"
import Worker from './worker?worker'

export const Terrain = () => {
  const ref = useRef<RapierRigidBody[]>(null)

  const boxGeometry = new BoxGeometry(1, 1, 1)
  const materials = new Materials()
  const [count,] = useState(100)

  useEffect(() => {
    if (ref.current) {
      let index = 0;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          ref.current.at(index)?.setTranslation({ x: i, y: 0, z: j }, true)
          index += 1;
        }
      }
    }
  }, [])

  const instances = useMemo(() => {
    const instances: InstancedRigidBodyProps[] = [];

    for (let i = 0; i < count * count; i++) {
      instances.push({
        key: 'instance_' + Math.random(),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
      });
    }

    return instances;
  }, []);

  return (
    <InstancedRigidBodies ref={ref} instances={instances} type="fixed">
      <instancedMesh args={[boxGeometry, materials.get(MaterialType.grass), count * count]}></instancedMesh>
    </InstancedRigidBodies>
  )
}