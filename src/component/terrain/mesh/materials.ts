import { NearestFilter, RepeatWrapping } from 'three';
import * as THREE from 'three'
import grass_side from '@/assets/textures/block/grass_block_side.png'
import grass_top_green from '@/assets/textures/block/grass_top_green.png'
import dirt from '@/assets/textures/block/dirt.png'


export enum MaterialType {
  grass = 'grass',
}
const loader = new THREE.TextureLoader()

const grassTopMaterial = loader.load(grass_top_green)
const grassMaterial = loader.load(grass_side)
const dirtMaterial = loader.load(dirt)
// const bedrockMaterial = loader.load(bedrock)
// bedrockMaterial.magFilter = NearestFilter
// bedrockMaterial.wrapS = RepeatWrapping
// bedrockMaterial.wrapT = RepeatWrapping
grassTopMaterial.magFilter = THREE.NearestFilter
grassMaterial.magFilter = THREE.NearestFilter
dirtMaterial.magFilter = THREE.NearestFilter

export default class Materials {
  materials = {
    grass: [
      new THREE.MeshStandardMaterial({ map: grassMaterial }),
      new THREE.MeshStandardMaterial({ map: grassMaterial }),
      new THREE.MeshStandardMaterial({
        map: grassTopMaterial
      }),
      new THREE.MeshStandardMaterial({ map: dirtMaterial }),
      new THREE.MeshStandardMaterial({ map: grassMaterial }),
      new THREE.MeshStandardMaterial({ map: grassMaterial })
    ]
  }

  get = (
    type: MaterialType
  ): THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[] => {
    return this.materials[type]
  }
}
