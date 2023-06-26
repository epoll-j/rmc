import Noise from '@/utils/noise';
import * as THREE from 'three';
import { BoxGeometry, InstancedMesh, Matrix4, MeshBasicMaterial, Raycaster, Vector3 } from "three";

export enum CollideSide {
  front,
  back,
  left,
  right,
  down,
  up
}

export class CollideControl {
  constructor() {
    this.initRayCaster();
  }

  #raycasterMap = new Map<CollideSide, Raycaster>()
  #matrix = new Matrix4()
  #noise = Noise.getInstance()

  initRayCaster() {
    const raycasterDown = new Raycaster();
    const raycasterUp = new Raycaster();
    const raycasterFront = new Raycaster();
    const raycasterBack = new Raycaster();
    const raycasterRight = new Raycaster();
    const raycasterLeft = new Raycaster();

    raycasterUp.ray.direction = new Vector3(0, 1, 0);
    raycasterDown.ray.direction = new Vector3(0, -1, 0);
    raycasterFront.ray.direction = new Vector3(1, 0, 0);
    raycasterBack.ray.direction = new Vector3(-1, 0, 0);
    raycasterLeft.ray.direction = new Vector3(0, 0, -1);
    raycasterRight.ray.direction = new Vector3(0, 0, 1);

    raycasterUp.far = 1.2;
    raycasterDown.far = 1.8;
    raycasterFront.far = 1;
    raycasterBack.far = 1;
    raycasterLeft.far = 1;
    raycasterRight.far = 1;

    this.#raycasterMap.set(CollideSide.front, raycasterFront)
    this.#raycasterMap.set(CollideSide.back, raycasterBack)
    this.#raycasterMap.set(CollideSide.left, raycasterLeft)
    this.#raycasterMap.set(CollideSide.right, raycasterRight)
    this.#raycasterMap.set(CollideSide.down, raycasterDown)
    this.#raycasterMap.set(CollideSide.up, raycasterUp)
  }

  check(side: CollideSide, position: Vector3): boolean {
    const tempMesh = new InstancedMesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial(),
      16
    )
    tempMesh.instanceMatrix = new THREE.InstancedBufferAttribute(
      new Float32Array(100 * 16),
      16
    )
    let x = Math.round(position.x)
    let z = Math.round(position.z)
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const raycaster = this.#raycasterMap.get(side)!
    raycaster.ray.origin = new Vector3().copy(position)

    switch(side) {
      case CollideSide.front:
        x += 1
        break
      case CollideSide.back:
        x -= 1
        break
      case CollideSide.left:
        z -= 1
        break
      case CollideSide.right:
        z += 1
        break
    }
    
    const y =
      Math.floor(
        this.#noise.get(x / this.#noise.gap, z / this.#noise.gap, this.#noise.seed) * this.#noise.amp
      ) + 30
    
    this.#matrix.setPosition(x, y, z)
    tempMesh.setMatrixAt(0, this.#matrix)

    tempMesh.instanceMatrix.needsUpdate = true
    
    return raycaster.intersectObject(tempMesh).length != 0
  }


  private getFloorPosition(position: Vector3): Vector3 {
    return new Vector3(Math.floor(position.x), Math.floor(position.y), Math.floor(position.z))
  }

  private getCeilPosition(position: Vector3): Vector3 {
    return new Vector3(Math.ceil(position.x), Math.ceil(position.y), Math.ceil(position.z))
  }

  private getPositionId(position: Vector3) {
    return `${position.x}_${position.y}_${position.z}`
  }
}
