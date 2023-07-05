import React, { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import { BoundingBoxGizmo } from "./MakeExtrusion";

const BabylonScene = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = sceneRef.current;

    // Create the Babylon.js engine
    const engine = new BABYLON.Engine(canvas, true);

    // Create a scene
    const scene = new BABYLON.Scene(engine);

    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position = BABYLON.Vector3.Zero();
    // Create a camera
    // const camera = new BABYLON.FreeCamera(
    //   "camera",
    //   new BABYLON.Vector3(0, 0, 10),
    //   scene
    // );
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      0,
      10,
      box.position,
      scene
    );

    // camera.setPosition(new BABYLON.Vector3(0, 0, -15));
    // Set the target of the camera to the center of the scene
    // camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    // Create a light
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 10, 0),
      scene
    );

    scene.onPointerDown = function castRay() {
      const hit = scene.pick(scene.pointerX, scene.pointerY);

      if (hit.faceId === -1)
        console.log("you did not click on any object in the scene");
      else {
        // console.log(hit.getNormal());
        // console.log(hit.pickedPoint);
        scene.onPointerMove = (e) => {
          let positions = box.getVerticesData(
            BABYLON.VertexBuffer.PositionKind
          );
          console.log(positions);
          box.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
          //console.log(
          //  (hit.pickedMesh.setAbsolutePosition = new BABYLON.Vector3(
          //    e.clientX / 10,
          //    0,
          //    e.clientY / 10
          //  ))
          // );
        };
      }
    };

    const boundingBoxGizmo = new BoundingBoxGizmo();
    boundingBoxGizmo.setColor(new BABYLON.Color3(0, 0.7, 1));
    boundingBoxGizmo.attachedMesh = box;
    boundingBoxGizmo.updateBoundingBox();

    boundingBoxGizmo.enableDragBehavior();

    window.addEventListener("resize", function () {
      engine.resize();
    });
    // Run the render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Clean up on component unmount
    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return <canvas ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default BabylonScene;