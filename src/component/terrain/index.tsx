import { useBlocks } from "@/hooks/store/useBlocks"
import { memo, useEffect, useMemo, useRef } from "react"
import { BoxGeometry, InstancedBufferAttribute, Vector2 } from "three"
import Materials, { MaterialType } from "./mesh/materials"
import Worker from './worker?worker'

const materialList = [MaterialType.grass]
const blocksFactor = [1]
const distance = 3
const chunkSize = 24

export const Terrain = memo(() => {
  const { setBlockMap } = useBlocks()
  const boxGeometry = new BoxGeometry()
  const materials = new Materials()
  const generateWorker = new Worker()
  const chunk = new Vector2(0, 0)
  let blocksCount = new Array(materialList.length).fill(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refs = useRef<any[]>([])

  useEffect(() => {
    generateWorker.onmessage = (msg => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      blocksCount = msg.data.blocksCount
      for (let i = 0; i < msg.data.arrays.length; i++) {
        refs.current[i].instanceMatrix = new InstancedBufferAttribute(
          (refs.current[i].instanceMatrix.array = msg.data.arrays[i]),
          16
        )
      }

      for (const block of refs.current) {
        block.instanceMatrix.needsUpdate = true
        block.frustumCulled = false
      }
      setBlockMap(msg.data.idMap)
    })

    generateWorker.postMessage(
      {
        distance: distance,
        chunk: chunk,
        idMap: new Map<string, number>(),
        blocksFactor: blocksFactor,
        blocksCount: blocksCount,
        chunkSize: chunkSize
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mesh = useMemo(() => {
    return (
      <>
        {
          materialList.map((type, index) =>
            <instancedMesh key={index} ref={(ref) => { refs.current[index] = ref }} args={[boxGeometry, materials.get(type), (distance * chunkSize * 2 + chunkSize) ** 2 + 500]}></instancedMesh>
          )
        }
      </>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return mesh
})