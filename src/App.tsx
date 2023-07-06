import { Sky, KeyboardControls, PointerLockControls } from "@react-three/drei";
import './App.css'
import { Canvas } from '@react-three/fiber'
import Player from './component/player/Player'
import { Terrain } from './component/terrain/index'
import { Suspense } from "react";
import { Physics } from "@react-three/rapier"

function App() {

  return (
    // <KeyboardControls
    //   map={[
    //     { name: "forward", keys: ["ArrowUp", "w", "W"] },
    //     { name: "backward", keys: ["ArrowDown", "s", "S"] },
    //     { name: "left", keys: ["ArrowLeft", "a", "A"] },
    //     { name: "right", keys: ["ArrowRight", "d", "D"] },
    //     { name: "jump", keys: ["Space"] },
    //     { name: "shift", keys: ["Shift"] }
    //   ]}>
      <Canvas camera={{
        fov: 50, near: 0.01, far: 500, position: [0, 100, 0]
      }}>
        <Sky />
        <ambientLight intensity={0.3} />
        <Suspense>
          <Physics debug>
            <Player></Player>
            <Terrain></Terrain>
          </Physics>
        </Suspense>
        <PointerLockControls></PointerLockControls>
      </Canvas>
    // </KeyboardControls>
  )
}

export default App