import Noise from '@/utils/noise';
import * as THREE from 'three';
import { BoxGeometry, InstancedMesh, Matrix4, MeshBasicMaterial, Raycaster, Vector3 } from "three";

export enum CollideSide {
  down,
}

export class CollideControl {
  constructor() {
    this.initRayCaster();
  }

  #raycasterDown = new Raycaster();
  #raycasterUp = new Raycaster();
  #raycasterFront = new Raycaster();
  #raycasterBack = new Raycaster();
  #raycasterRight = new Raycaster();
  #raycasterLeft = new Raycaster();
  #matrix = new Matrix4()
  #noise = Noise.getInstance()

  initRayCaster() {
    this.#raycasterUp.ray.direction = new Vector3(0, 1, 0);
    this.#raycasterDown.ray.direction = new Vector3(0, -1, 0);
    this.#raycasterFront.ray.direction = new Vector3(1, 0, 0);
    this.#raycasterBack.ray.direction = new Vector3(-1, 0, 0);
    this.#raycasterLeft.ray.direction = new Vector3(0, 0, -1);
    this.#raycasterRight.ray.direction = new Vector3(0, 0, 1);

    this.#raycasterUp.far = 1.2;
    this.#raycasterDown.far = 1.8;
    this.#raycasterFront.far = 1;
    this.#raycasterBack.far = 1;
    this.#raycasterLeft.far = 1;
    this.#raycasterRight.far = 1;
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
    const y =
      Math.floor(
        this.#noise.get(x / this.#noise.gap, z / this.#noise.gap, this.#noise.seed) * this.#noise.amp
      ) + 30
    let index = 0
    
    switch(side) {
      case CollideSide.down:
        this.#matrix.setPosition(x, y, z)
        tempMesh.setMatrixAt(index++, this.#matrix)
        this.#raycasterDown.ray.origin = new Vector3().copy(position)
        break
    }

    tempMesh.instanceMatrix.needsUpdate = true

    switch(side) {
      case CollideSide.down:
        return this.#raycasterDown.intersectObject(tempMesh).length != 0
    }

    return false;
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
