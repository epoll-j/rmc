import * as THREE from "three";
import Materials, { MaterialType } from './mesh/materials'

export const Terrain = () => {

  const boxGeometry = new THREE.BoxGeometry()
  const materials = new Materials()

  return (
    <>
      <instancedMesh args={[boxGeometry, materials.get(MaterialType.grass), 200]}>
      </instancedMesh>
    </>
  )
}