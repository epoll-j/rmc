import { PointerLockControls, Sky, KeyboardControls } from "@react-three/drei";
import './App.css'
import { Physics } from '@react-three/rapier'
import { Canvas } from '@react-three/fiber'
import { Terrain } from './component/terrain/index'
import { Player } from './component/player/index'
import { Bedrock } from './component/terrain/bedrock'

function App() {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
      ]}>
      <Canvas camera={{ fov: 45 }}>
        <Sky />
        <ambientLight intensity={0.3} />
        <Physics gravity={[0, -30, 0]}>
          <Player></Player>
          {/* <Terrain></Terrain> */}
          <Bedrock></Bedrock>
        </Physics>
        <PointerLockControls />
      </Canvas>
    </KeyboardControls>
  )
}

export default App
