import { BoxGeometry, InstancedBufferAttribute, InstancedMesh, Matrix4, MeshBasicMaterial, Vector2 } from 'three'
// import Block from '../mesh/block'
import Noise from '@/utils/noise'

enum BlockType {
  grass = 0,
}

const matrix = new Matrix4()
const noise = Noise.getInstance()
const blocks: InstancedMesh[] = []

const geometry = new BoxGeometry()

let isFirstRun = true

onmessage = (
  msg: MessageEvent<{
    distance: number
    chunk: Vector2
    idMap: Map<string, number>
    blocksFactor: number[]
    blocksCount: number[]
    // customBlocks: Block[]
    chunkSize: number
  }>
) => {
  const {
    distance,
    chunk,
    idMap,
    blocksFactor,
    // customBlocks,
    blocksCount,
    chunkSize
  } = msg.data

  const maxCount = (distance * chunkSize * 2 + chunkSize) ** 2 + 500

  if (isFirstRun) {
    for (let i = 0; i < blocksCount.length; i++) {
      const block = new InstancedMesh(
        geometry,
        new MeshBasicMaterial(),
        maxCount * blocksFactor[i]
      )
      blocks.push(block)
    }

    isFirstRun = false
  }

  for (let i = 0; i < blocks.length; i++) {
    blocks[i].instanceMatrix = new InstancedBufferAttribute(
      new Float32Array(maxCount * blocksFactor[i] * 16),
      16
    )
  }
  for (
    let x = -chunkSize * distance + chunkSize * chunk.x;
    x < chunkSize * distance + chunkSize + chunkSize * chunk.x;
    x++
  ) {
    for (
      let z = -chunkSize * distance + chunkSize * chunk.y;
      z < chunkSize * distance + chunkSize + chunkSize * chunk.y;
      z++
    ) {
      const y = 30
      const yOffset = Math.floor(
        noise.get(x / noise.gap, z / noise.gap, noise.seed) * noise.amp
      )

      matrix.setPosition(x, y + yOffset, z)
      idMap.set(`${x}_${y + yOffset}_${z}`, blocksCount[BlockType.grass])
      blocks[BlockType.grass].setMatrixAt(
        blocksCount[BlockType.grass]++,
        matrix
      )
    }
  }

  const arrays = blocks.map(block => block.instanceMatrix.array)
  postMessage({ idMap, arrays, blocksCount })
}
