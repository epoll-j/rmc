import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

onmessage = (
  msg: MessageEvent<{
    bedrockSize: number;
  }>
) => {
  const noise = new ImprovedNoise();
  const heightArr = [];
  for (let x = 0; x < msg.data.bedrockSize; x++) {
    for (let y = 0; y < msg.data.bedrockSize; y++) {
      const height = Math.floor(noise.noise(x * 0.1, y * 0.1, 0.5) + 1 / 2 * 10);
      heightArr.push(height);
    }
  }

  postMessage({ heightArr });
};
