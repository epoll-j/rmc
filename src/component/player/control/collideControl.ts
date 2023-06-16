import * as THREE from 'three';
import { BoxGeometry, InstancedMesh, Matrix4, MeshBasicMaterial, Raycaster, Vector3, Vector4 } from "three";

export enum CollideSide {
  down,
}

export class CollideControl {
  constructor() {
    this.initRayCaster();
  }

  raycasterDown = new Raycaster();
  raycasterUp = new Raycaster();
  raycasterFront = new Raycaster();
  raycasterBack = new Raycaster();
  raycasterRight = new Raycaster();
  raycasterLeft = new Raycaster();
  matrix = new Matrix4()

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

  check(side: CollideSide, position: Vector3, blockMap: Map<string, number>) {
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
    const blockId = blockMap.get(`${Math.floor(position.x)}_${Math.floor(position.y - this.raycasterDown.far)}_${Math.floor(position.z)}`)
    // console.log(blockId, position)
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
}
