import Noise from "@/utils/noise";
import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import {
  BoxGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector3,
} from "three";
import { Octree } from "three/examples/jsm/math/Octree";

export enum CollideSide {
  front,
  back,
  left,
  right,
  down,
  up,
}

export class CollideControl {
  constructor() {
    this.initRayCaster();
  }

  #raycasterMap = new Map<CollideSide, Raycaster>();
  #matrix = new Matrix4();
  #noise = Noise.getInstance();

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

    this.#raycasterMap.set(CollideSide.front, raycasterFront);
    this.#raycasterMap.set(CollideSide.back, raycasterBack);
    this.#raycasterMap.set(CollideSide.left, raycasterLeft);
    this.#raycasterMap.set(CollideSide.right, raycasterRight);
    this.#raycasterMap.set(CollideSide.down, raycasterDown);
    this.#raycasterMap.set(CollideSide.up, raycasterUp);
  }

  check(side: CollideSide, position: Vector3): boolean {
    const tempMesh = new InstancedMesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial(),
      16
    );
    tempMesh.instanceMatrix = new THREE.InstancedBufferAttribute(
      new Float32Array(100 * 16),
      16
    );
    let x = Math.round(position.x);
    let z = Math.round(position.z);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const raycaster = this.#raycasterMap.get(side)!;
    raycaster.ray.origin = new Vector3().copy(position);

    switch (side) {
      case CollideSide.front:
        x += 1;
        break;
      case CollideSide.back:
        x -= 1;
        break;
      case CollideSide.left:
        z -= 1;
        break;
      case CollideSide.right:
        z += 1;
        break;
    }

    const y =
      Math.floor(
        this.#noise.get(
          x / this.#noise.gap,
          z / this.#noise.gap,
          this.#noise.seed
        ) * this.#noise.amp
      ) + 30;

    this.#matrix.setPosition(2, 0, 2);
    tempMesh.setMatrixAt(0, this.#matrix);

    tempMesh.instanceMatrix.needsUpdate = true;

    if (side == CollideSide.up || side == CollideSide.down) {
      return raycaster.intersectObject(tempMesh).length != 0;
    }

    const origin = new THREE.Vector3(position.x, position.y - 1, position.z);
    const collideCount = raycaster.intersectObject(tempMesh).length;
    raycaster.ray.origin = origin;
    return collideCount != 0 || raycaster.intersectObject(tempMesh).length != 0;
  }

  checkAll(position: Vector3): [boolean, boolean, boolean, boolean] {
    return [
      this.check(CollideSide.front, position),
      this.check(CollideSide.back, position),
      this.check(CollideSide.left, position),
      this.check(CollideSide.right, position),
    ];
  }

  // private getFloorPosition(position: Vector3): Vector3 {
  //   return new Vector3(Math.floor(position.x), Math.floor(position.y), Math.floor(position.z))
  // }

  // private getCeilPosition(position: Vector3): Vector3 {
  //   return new Vector3(Math.ceil(position.x), Math.ceil(position.y), Math.ceil(position.z))
  // }

  // private getPositionId(position: Vector3) {
  //   return `${position.x}_${position.y}_${position.z}`
  // }

  moveRigidBody(position: Vector3, rigidBody: RapierRigidBody[]) {
    const x = Math.round(position.x);
    const z = Math.round(position.z);
    const y =
      Math.floor(
        this.#noise.get(
          x / this.#noise.gap,
          z / this.#noise.gap,
          this.#noise.seed
        ) * this.#noise.amp
      ) + 30;

    for (let i = 0; i < 9; i++) {
      switch (i) {
        case 0:
          rigidBody.at(i)?.setTranslation({ x: x, y: y, z: z }, true);
          // rigidBody.at(10)?.setTranslation({x: x, y: y, z: z}, true)
          break;
        case 1:
          rigidBody.at(i)?.setTranslation({ x: x + 1, y: y, z: z }, true);
          break;
        case 2:
          rigidBody.at(i)?.setTranslation({ x: x - 1, y: y, z: z }, true);
          break;
        case 3:
          rigidBody.at(i)?.setTranslation({ x: x, y: y, z: z + 1 }, true);
          break;
        case 4:
          rigidBody.at(i)?.setTranslation({ x: x, y: y, z: z - 1 }, true);
          break;
        // case 5:
        //   rigidBody.at(i)?.setTranslation({ x: x + 1, y: y, z: z + 1 }, true);
        //   break;
        // case 6:
        //   rigidBody.at(i)?.setTranslation({ x: x - 1, y: y, z: z + 1 }, true);
        //   break;
        // case 7:
        //   rigidBody.at(i)?.setTranslation({ x: x + 1, y: y, z: z - 1 }, true);
        //   break;
        // case 8:
        //   rigidBody.at(i)?.setTranslation({ x: x - 1, y: y, z: z - 1 }, true);
        //   break;
      }
    }
  }

  buildOctree(position: Vector3) {
    const group = new Group();
    const x = Math.round(position.x);
    const z = Math.round(position.z);
    const y =
      Math.floor(
        this.#noise.get(
          x / this.#noise.gap,
          z / this.#noise.gap,
          this.#noise.seed
        ) * this.#noise.amp
      ) + 30;

    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial();
    for (let i = 0; i < 9; i++) {
      const mesh = new Mesh(geometry, material);
      switch (i) {
        case 0:
          mesh.position.set(x, y, z);
          break;
        case 1:
          mesh.position.set(x + 1, y, z);
          break;
        case 2:
          mesh.position.set(x - 1, y, z);
          break;
        case 3:
          mesh.position.set(x, y, z + 1);
          break;
        case 4:
          mesh.position.set(x, y, z - 1);
          break;
        case 5:
          mesh.position.set(x + 1, y, z + 1);
          break;
        case 6:
          mesh.position.set(x - 1, y, z + 1);
          break;
        case 7:
          mesh.position.set(x + 1, y, z - 1);
          break;
        case 8:
          mesh.position.set(x - 1, y, z - 1);
          break;
      }

      group.add(mesh);
    }

    return new Octree().fromGraphNode(group);
  }
}
