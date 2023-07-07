import { useFrame } from "@react-three/fiber";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThree } from "@react-three/fiber";
import {
  CameraHelper,
  OrthographicCamera,
  PerspectiveCamera,
  WebGLRenderer,
} from "three";

export function useCameraHelper() {
  const { gl, scene, camera } = useThree();
  const helperCamera = new OrthographicCamera(-1, 1, 1, -1, 5, 50);
  const helper = new CameraHelper(camera);
  scene.add(helper);
  const [div1, div2] = appendDom(gl.domElement.parentElement);

  const controls = new OrbitControls(helperCamera, div1);
  controls.target.set(0, 5, 0);
  controls.update();

  useFrame(() => {
    gl.setScissorTest(true);
    {
      const aspect = setScissorForElement(gl, div1);
      helperCamera.left = -aspect;
      helperCamera.right = aspect;
      helperCamera.updateProjectionMatrix();
      helper.visible = false;
      helper.update();

      gl.render(scene, helperCamera);
    }

    {
      const aspect = setScissorForElement(gl, div2);
      if (camera instanceof PerspectiveCamera) {
        camera.aspect = aspect;
      }
      camera.updateProjectionMatrix();
      helper.visible = true;
      gl.render(scene, camera);
    }
  });
}

function appendDom(root: HTMLElement | null) {
  const split = document.createElement("div");
  split.style.cssText =
    "position: absolute;left: 0;top: 0;width: 100%;height: 100%;display: flex;";
  const div1 = document.createElement("div");
  div1.style.cssText = "width: 100%;height: 100%;";
  const div2 = document.createElement("div");
  div2.style.cssText = "width: 100%;height: 100%;";
  split.appendChild(div1);
  split.appendChild(div2);
  root?.appendChild(split);

  return [div1, div2];
}

function setScissorForElement(render: WebGLRenderer, elem: HTMLDivElement) {
  const canvasRect = render.domElement.getBoundingClientRect(); //包围盒的正方体
  const elemRect = elem.getBoundingClientRect();

  // compute a canvas relative rectangle
  const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
  const left = Math.max(0, elemRect.left - canvasRect.left);
  const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
  const top = Math.max(0, elemRect.top - canvasRect.top);

  const width = Math.min(canvasRect.width, right - left);
  const height = Math.min(canvasRect.height, bottom - top);

  // setup the scissor to only render to that part of the canvas
  const positiveYUpBottom = canvasRect.height - bottom;
  render.setScissor(left, positiveYUpBottom, width, height);
  render.setViewport(left, positiveYUpBottom, width, height);

  // return the aspect
  return width / height;
}
