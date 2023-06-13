import { Sky, KeyboardControls, PointerLockControls } from "@react-three/drei";
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Player } from './component/player/index'
import { Bedrock } from './component/terrain/bedrock'
import { Suspense } from "react";

function App() {

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "shift", keys: ["Shift"] }
      ]}>
      <Canvas camera={{ fov: 50, near: 0.01, far: 500 }}>
        <Sky />
        <ambientLight intensity={0.3} />
        <Player></Player>
        <Suspense>
          <Bedrock></Bedrock>
        </Suspense>
        <PointerLockControls></PointerLockControls>
      </Canvas>
    </KeyboardControls>
  )
}

export default App
