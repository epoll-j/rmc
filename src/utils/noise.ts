import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise'

export default class Noise {
  private static instance: Noise
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): Noise {
    if (!Noise.instance) {
      Noise.instance = new Noise()
    }
    return Noise.instance
  }
  noise = new ImprovedNoise()
  seed = Math.random()
  gap = 22
  amp = 8

  get = (x: number, y: number, z: number) => {
    return this.noise.noise(x, y, z)
  }
}