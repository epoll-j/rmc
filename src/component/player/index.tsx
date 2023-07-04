import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { BoxGeometry, Mesh, Vector3 } from "three"
import useFPS from "@/hooks/useFPS"
import { CollideControl, CollideSide } from "./control/CollideControl"
import { MoveControl } from "./control/moveControl"
import { CapsuleCollider, InstancedRigidBodies, InstancedRigidBodyProps, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier"


const frontVector = new Vector3()
const sideVector = new Vector3()
const direction = new Vector3()
const runMultiplier = 1.15
const blocksPerSec = 5
const control = new CollideControl()
const moveControl = new MoveControl()

export const Player = () => {
  // const ref = useRef<Mesh>(null)
  // const fpsRef = useFPS()
  const [, get] = useKeyboardControls()
  // const { camera } = useThree()
  // camera.lookAt(100, 30, 100)
  const ref = useRef<RapierRigidBody>()
  const rigidBodies = useRef<RapierRigidBody[]>([]);

  const instances = useMemo(() => {
    const instances: InstancedRigidBodyProps[] = [];
    
    for (let i = 0; i < 10; i++) {
      instances.push({
        key: `instance_${i}`,
        position: [0, 0, 0],
        // rotation: [Math.random(), Math.random(), Math.random()]
      });
    }

    return instances;
  }, []);

  useFrame((state) => {
    const { forward, backward, left, right } = get()
    if (ref.current) {
      const velocity = ref.current.linvel()
      // update camera
      // state.camera.position.set(ref.current.translation().x, ref.current.translation().y, ref.current.translation().z)
      const translation = ref.current.translation()
      state.camera.position.set(translation.x, translation.y, translation.z)
      control.moveRigidBody(new Vector3(translation.x, translation.y, translation.z), rigidBodies.current)
      // movement
      frontVector.set(0, 0, Number(backward) - Number(forward))
      sideVector.set(Number(right) - Number(left), 0, 0)
      direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(5).applyEuler(state.camera.rotation)
      ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)
      // frontDirection.set(0, 0, 0)
      // sideDirection.set(0, 0, 0)
      // speed = (blocksPerSec + blocksPerSec * Number(shift) * runMultiplier) / fpsRef.current
      // if (speed != Infinity) {
      //   state.camera.position.copy(ref.current.position)
        
      //   frontDirection.set(0, 0, Number(backward) - Number(forward))
      //   sideDirection.set(Number(right) - Number(left), 0, 0)
      //   const finalDirection = new Vector3()
      //   finalDirection.addVectors(frontDirection, sideDirection)
      //   moveControl.move(state.camera, ref.current, finalDirection, speed)
      //   // finalDirection.multiplyScalar(speed)
      //   // finalDirection.applyQuaternion(state.camera.quaternion)
      //   // const vector = new Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion)
      //   // const cameraDirection = Math.atan2(vector.x, vector.z)
      //   // const [frontCollide, backCollide, leftCollide, rightCollide] = control.checkAll(state.camera.position)
      //   // frontCollide, backCollide, leftCollide, rightCollide, cameraDirection
      //   // console.log(frontCollide, backCollide, leftCollide, rightCollide, cameraDirection)
      //   // ref.current.position.set(ref.current.position.x + finalDirection.x, ref.current.position.y - (control.check(CollideSide.down, state.camera.position) ? 0 : speed), ref.current.position.z + finalDirection.z)
      //   // ref.current.position.set(ref.current.position.x + finalDirection.x, ref.current.position.y - (control.check(CollideSide.down, state.camera.position) ? 0 : 0), ref.current.position.z + finalDirection.z)
      // }
    }
  })
  return (
    <>
      <RigidBody ref={ref} mass={1} type="dynamic" position={[0, 40, 0]} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.75, 0.5]} />
        <mesh></mesh>
      </RigidBody>
      <InstancedRigidBodies ref={rigidBodies} instances={instances} type="fixed" colliders="cuboid">
        <instancedMesh args={[new BoxGeometry(), undefined, 10]} count={10}></instancedMesh>
      </InstancedRigidBodies>
    </>
  )
}