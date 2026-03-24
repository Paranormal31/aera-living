"use client";

import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { DEFAULT_CAMERA, DEFAULT_CONTAINER_STYLE, DEFAULT_LIGHTING } from "./defaults";
import { Robot } from "./Robot";
import { RobotSceneProps } from "./types";

export default function Scene({
  robotProps,
  camera = DEFAULT_CAMERA,
  containerStyle,
  environmentPreset = "city",
  directionalLight = DEFAULT_LIGHTING.directional,
  ambientLightIntensity = DEFAULT_LIGHTING.ambient,
  spotLights = [...DEFAULT_LIGHTING.spots],
}: RobotSceneProps = {}) {
  return (
    <div style={{ ...DEFAULT_CONTAINER_STYLE, ...containerStyle }}>
      <Canvas camera={camera}>
        <ambientLight intensity={ambientLightIntensity} />
        <directionalLight intensity={directionalLight.intensity} position={directionalLight.position} />

        {spotLights.map((light, index) => (
          <spotLight
            key={`${light.color}-${index}`}
            angle={light.angle}
            color={light.color}
            distance={light.distance}
            intensity={light.intensity}
            penumbra={light.penumbra}
            position={light.position}
          />
        ))}

        <Robot {...robotProps} />

        <Suspense fallback={null}>
          <Environment preset={environmentPreset} />
        </Suspense>
      </Canvas>
    </div>
  );
}
