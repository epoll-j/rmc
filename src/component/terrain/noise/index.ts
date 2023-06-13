import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise'

export default class Noise {
  noise = new ImprovedNoise()
  seed = 0
  gap = 22
  amp = 8

  stoneSeed = 0.4
  stoneGap = 12
  stoneAmp = 8
  stoneThreshold = 3.5

  coalSeed = 0.5
  coalGap = 3
  coalAmp = 8
  coalThreshold = 3

  treeSeed = 0.7
  treeGap = 2
  treeAmp = 6
  treeHeight = 10
  treeThreshold = 4

  leafSeed = 0.8
  leafGap = 2
  leafAmp = 5
  leafThreshold = -0.03

  get = (x: number, y: number, z: number) => {
    return this.noise.noise(x, y, z)
  }
}