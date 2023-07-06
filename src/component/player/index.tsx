import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { Mesh, Vector3 } from "three"
import useFPS from "@/hooks/useFPS"
import { CollideControl, CollideSide } from "./control/CollideControl"
import { MoveControl } from "./control/moveControl"
import useOctree from "@/hooks/useOctree"
import { Capsule } from 'three/examples/jsm/math/Capsule.js'

let speed = 0
const frontDirection = new Vector3()
const sideDirection = new Vector3()
const runMultiplier = 1.15
const blocksPerSec = 5
const control = new CollideControl()
const moveControl = new MoveControl()

export const Player = () => {
  const ref = useRef<Mesh>(null)
  const fpsRef = useFPS()
  const [, get] = useKeyboardControls()
  const { camera, scene } = useThree()
  camera.lookAt(100, 30, 100)
  const octree = useOctree(scene)
  const capsule = useMemo(() => new Capsule(new Vector3(0, 10, 0), new Vector3(0, 11, 0), 0.5), [])
  useFrame((state) => {
    
    const { forward, backward, left, right, shift } = get()
    if (ref.current) {
      capsule.translate(ref.current.position)
      frontDirection.set(0, 0, 0)
      sideDirection.set(0, 0, 0)
      speed = (blocksPerSec + blocksPerSec * Number(shift) * runMultiplier) / fpsRef.current
      if (speed != Infinity) {
        state.camera.position.copy(ref.current.position)
        
        frontDirection.set(0, 0, Number(backward) - Number(forward))
        sideDirection.set(Number(right) - Number(left), 0, 0)
        const finalDirection = new Vector3()
        finalDirection.addVectors(frontDirection, sideDirection)
        // moveControl.move(state.camera, ref.current, finalDirection, speed)
        finalDirection.multiplyScalar(speed)
        finalDirection.applyQuaternion(state.camera.quaternion)
        // const vector = new Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion)
        // const cameraDirection = Math.atan2(vector.x, vector.z)
        // const [frontCollide, backCollide, leftCollide, rightCollide] = control.checkAll(state.camera.position)
        // frontCollide, backCollide, leftCollide, rightCollide, cameraDirection
        // console.log(frontCollide, backCollide, leftCollide, rightCollide, cameraDirection)
        // ref.current.position.set(ref.current.position.x + finalDirection.x, ref.current.position.y - (control.check(CollideSide.down, state.camera.position) ? 0 : speed), ref.current.position.z + finalDirection.z)
        ref.current.position.set(ref.current.position.x + finalDirection.x, ref.current.position.y - (control.check(CollideSide.down, state.camera.position) ? 0 : 0), ref.current.position.z + finalDirection.z)
      }
    }
  })
  return (
    <>
      <mesh position={[2, 0, 2]} ref={ref}></mesh>
    </>
  )
}