import { CollideControl } from "./CollideControl";
import { Camera, Vector3, Mesh } from "three";
export class MoveControl {
  #collideControl = new CollideControl();

  move(camera: Camera, user: Mesh, vector: Vector3, speed: number) {
    const [frontCollide, backCollide, leftCollide, rightCollide] =
      this.#collideControl.checkAll(camera.position);
    const moveVector = new Vector3().copy(vector)
    moveVector.multiplyScalar(speed)
    moveVector.applyQuaternion(camera.quaternion)
    if (frontCollide || backCollide || leftCollide || rightCollide) {
      const directionVector = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      const direction = Math.atan2(directionVector.x, directionVector.z)
      // debugger
      if (frontCollide) {
        // camera front
        if (direction < Math.PI && direction > 0 && vector.x > 0) {
          if (
            (!leftCollide && direction > Math.PI / 2) ||
            (!rightCollide && direction < Math.PI / 2)
          ) {
            // this.moveZ(Math.PI / 2 - direction, delta);
          }
        } else if (
          !leftCollide &&
          !rightCollide &&
          vector.x > 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        }

        // camera back
        if (direction < 0 && direction > -Math.PI && vector.x < 0) {
          if (
            (!leftCollide && direction > -Math.PI / 2) ||
            (!rightCollide && direction < -Math.PI / 2)
          ) {
            // this.moveZ(-Math.PI / 2 - direction, delta);
          }
        } else if (
          !leftCollide &&
          !rightCollide &&
          vector.x < 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        }

        // camera left
        if (
          direction < Math.PI / 2 &&
          direction > -Math.PI / 2 &&
          vector.z < 0
        ) {
          if (
            (!rightCollide && direction < 0) ||
            (!leftCollide && direction > 0)
          ) {
            // this.moveZ(-direction, delta);
          }
        } else if (
          !leftCollide &&
          !rightCollide &&
          vector.z < 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        }

        // camera right
        if (
          (direction < -Math.PI / 2 || direction > Math.PI / 2) &&
          vector.z > 0
        ) {
          if (!rightCollide && direction > 0) {
            // this.moveZ(Math.PI - direction, delta);
          }
          if (!leftCollide && direction < 0) {
            // this.moveZ(-Math.PI - direction, delta);
          }
        } else if (
          !leftCollide &&
          !rightCollide &&
          vector.z > 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        }
      }

      // collide back (negative x)
      if (backCollide) {
        // camera front
        if (direction < 0 && direction > -Math.PI && vector.x > 0) {
          if (
            (!leftCollide && direction < -Math.PI / 2) ||
            (!rightCollide && direction > -Math.PI / 2)
          ) {
            // this.moveZ(Math.PI / 2 + direction, delta);
          }
        } else if (
          !leftCollide &&
          !rightCollide &&
          vector.x > 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        }

        // camera back
        if (direction < Math.PI && direction > 0 && vector.x < 0) {
          if (
            (!leftCollide && direction < Math.PI / 2) ||
            (!rightCollide && direction > Math.PI / 2)
          ) {
            // this.moveZ(direction - Math.PI / 2, delta);
          }
        } else if (
          !leftCollide &&
          !rightCollide &&
          vector.x < 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        }

        // camera left
        if (
          (direction < -Math.PI / 2 || direction > Math.PI / 2) &&
          vector.z < 0
        ) {
          if (!leftCollide && direction > 0) {
            // this.moveZ(-Math.PI + direction, delta);
          }
          if (!rightCollide && direction < 0) {
            // this.moveZ(Math.PI + direction, delta);
          }
        } else if (
          !leftCollide &&
          !rightCollide &&
          vector.z < 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        }

        // camera right
        if (
          direction < Math.PI / 2 &&
          direction > -Math.PI / 2 &&
          vector.z > 0
        ) {
          if (
            (!leftCollide && direction < 0) ||
            (!rightCollide && direction > 0)
          ) {
            // this.moveZ(direction, delta);
          }
        } else if (
          !leftCollide &&
          !rightCollide &&
          vector.z > 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        }
      }

      // collide left (negative z)
      if (leftCollide) {
        // camera front
        if (
          (direction < -Math.PI / 2 || direction > Math.PI / 2) &&
          vector.x > 0
        ) {
          if (!frontCollide && direction > 0) {
            // this.moveX(Math.PI - direction, delta);
          }
          if (!backCollide && direction < 0) {
            // this.moveX(-Math.PI - direction, delta);
          }
        } else if (
          !frontCollide &&
          !backCollide &&
          vector.x > 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        } else if (
          frontCollide &&
          direction < 0 &&
          direction > -Math.PI / 2 &&
          vector.x > 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        } else if (
          backCollide &&
          direction < Math.PI / 2 &&
          direction > 0 &&
          vector.x > 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        }

        // camera back
        if (
          direction < Math.PI / 2 &&
          direction > -Math.PI / 2 &&
          vector.x < 0
        ) {
          if (
            (!frontCollide && direction < 0) ||
            (!backCollide && direction > 0)
          ) {
            // this.moveX(-direction, delta);
          }
        } else if (
          !frontCollide &&
          !backCollide &&
          vector.x < 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        } else if (
          frontCollide &&
          direction < Math.PI &&
          direction > Math.PI / 2 &&
          vector.x < 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        } else if (
          backCollide &&
          direction > -Math.PI &&
          direction < -Math.PI / 2 &&
          vector.x < 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        }

        // camera left
        if (direction > 0 && direction < Math.PI && vector.z < 0) {
          if (
            (!backCollide && direction > Math.PI / 2) ||
            (!frontCollide && direction < Math.PI / 2)
          ) {
            // this.moveX(Math.PI / 2 - direction, delta);
          }
        } else if (
          !frontCollide &&
          !backCollide &&
          vector.z < 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        } else if (
          frontCollide &&
          direction > -Math.PI &&
          direction < -Math.PI / 2 &&
          vector.z < 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        } else if (
          backCollide &&
          direction > -Math.PI / 2 &&
          direction < 0 &&
          vector.z < 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        }

        // camera right
        if (direction < 0 && direction > -Math.PI && vector.z > 0) {
          if (
            (!backCollide && direction > -Math.PI / 2) ||
            (!frontCollide && direction < -Math.PI / 2)
          ) {
            // this.moveX(-Math.PI / 2 - direction, delta);
          }
        } else if (
          !frontCollide &&
          !backCollide &&
          vector.z > 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        } else if (
          frontCollide &&
          direction < Math.PI / 2 &&
          direction > 0 &&
          vector.z > 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        } else if (
          backCollide &&
          direction < Math.PI &&
          direction > Math.PI / 2 &&
          vector.z > 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        }
      }

      // collide right (positive z)
      if (rightCollide) {
        // camera front
        if (
          direction < Math.PI / 2 &&
          direction > -Math.PI / 2 &&
          vector.x > 0
        ) {
          if (
            (!backCollide && direction < 0) ||
            (!frontCollide && direction > 0)
          ) {
            // this.moveX(direction, delta);
          }
        } else if (
          !frontCollide &&
          !backCollide &&
          vector.x > 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        } else if (
          frontCollide &&
          direction < -Math.PI / 2 &&
          direction > -Math.PI &&
          vector.x > 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        } else if (
          backCollide &&
          direction < Math.PI &&
          direction > Math.PI / 2 &&
          vector.x > 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        }

        // camera back
        if (
          (direction < -Math.PI / 2 || direction > Math.PI / 2) &&
          vector.x < 0
        ) {
          if (!backCollide && direction > 0) {
            // this.moveX(-Math.PI + direction, delta);
          }
          if (!frontCollide && direction < 0) {
            // this.moveX(Math.PI + direction, delta);
          }
        } else if (
          !frontCollide &&
          !backCollide &&
          vector.x < 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        } else if (
          frontCollide &&
          direction < Math.PI / 2 &&
          direction > 0 &&
          vector.x < 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        } else if (
          backCollide &&
          direction < 0 &&
          direction > -Math.PI / 2 &&
          vector.x < 0
        ) {
          // this.control.moveForward(this.velocity.x * delta);
          user.position.setX(user.position.x + moveVector.x)
        }

        // camera left
        if (direction < 0 && direction > -Math.PI && vector.z < 0) {
          if (
            (!frontCollide && direction > -Math.PI / 2) ||
            (!backCollide && direction < -Math.PI / 2)
          ) {
            // this.moveX(Math.PI / 2 + direction, delta);
          }
        } else if (
          !frontCollide &&
          !backCollide &&
          vector.z < 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        } else if (
          frontCollide &&
          direction > Math.PI / 2 &&
          direction < Math.PI &&
          vector.z < 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        } else if (
          backCollide &&
          direction > 0 &&
          direction < Math.PI / 2 &&
          vector.z < 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        }

        // camera right
        if (direction > 0 && direction < Math.PI && vector.z > 0) {
          if (
            (!frontCollide && direction > Math.PI / 2) ||
            (!backCollide && direction < Math.PI / 2)
          ) {
            // this.moveX(direction - Math.PI / 2, delta);
          }
        } else if (
          !frontCollide &&
          !backCollide &&
          vector.z > 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        } else if (
          frontCollide &&
          direction > -Math.PI / 2 &&
          direction < 0 &&
          vector.z > 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        } else if (
          backCollide &&
          direction > -Math.PI &&
          direction < -Math.PI / 2 &&
          vector.z > 0
        ) {
          // this.control.moveRight(this.velocity.z * delta);
          user.position.setZ(user.position.z + moveVector.z)
        }
      }
    } else {
      user.position.set(user.position.x + moveVector.x, 0, user.position.z + moveVector.z)
    }
  }
}
