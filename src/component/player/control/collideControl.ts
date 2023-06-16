import * as THREE from 'three';
import { BoxGeometry, InstancedMesh, Matrix4, MeshBasicMaterial, Raycaster, Vector3 } from "three";

export enum CollideSide {
  down,
}

export class CollideControl {
  constructor() {
    this.initRayCaster();
  }

  private raycasterDown = new Raycaster();
  private raycasterUp = new Raycaster();
  private raycasterFront = new Raycaster();
  private raycasterBack = new Raycaster();
  private raycasterRight = new Raycaster();
  private raycasterLeft = new Raycaster();
  private matrix = new Matrix4()

  initRayCaster() {
    this.raycasterUp.ray.direction = new Vector3(0, 1, 0);
    this.raycasterDown.ray.direction = new Vector3(0, -1, 0);
    this.raycasterFront.ray.direction = new Vector3(1, 0, 0);
    this.raycasterBack.ray.direction = new Vector3(-1, 0, 0);
    this.raycasterLeft.ray.direction = new Vector3(0, 0, -1);
    this.raycasterRight.ray.direction = new Vector3(0, 0, 1);

    this.raycasterUp.far = 1.2;
    this.raycasterDown.far = 1.8;
    this.raycasterFront.far = 1;
    this.raycasterBack.far = 1;
    this.raycasterLeft.far = 1;
    this.raycasterRight.far = 1;
  }

  check(side: CollideSide, position: Vector3, blockMap: Map<string, number>): boolean {
    const floorPosition = this.getFloorPosition(position)
    const tempMesh = new InstancedMesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial(),
      16
    )
    tempMesh.instanceMatrix = new THREE.InstancedBufferAttribute(
      new Float32Array(100 * 16),
      16
    )
    let index = 0
    const blockId = blockMap.get(`${floorPosition.x}_${Math.floor(position.y - this.raycasterDown.far)}_${floorPosition.z}`)
    if (!blockId) {
      return false
    }
    this.matrix.setPosition(Math.floor(position.x), Math.floor(position.y - this.raycasterDown.far), Math.floor(position.z))
    tempMesh.setMatrixAt(index++, this.matrix)
    switch(side) {
      case CollideSide.down:
        this.raycasterDown.ray.origin = position
    }

    tempMesh.instanceMatrix.needsUpdate = true

    switch(side) {
      case CollideSide.down:
        return this.raycasterDown.intersectObject(tempMesh).length != 0
    }

    return false;
  }

  private getFloorPosition(position: Vector3): Vector3 {
    return new Vector3(Math.floor(position.x), Math.floor(position.y), Math.floor(position.z))
  }
}
