"use client";

import { Html, RoundedBox, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  DEFAULT_EMOJIS,
  DEFAULT_POINTER_CHANNEL,
} from "./defaults";
import {
  Emotion,
  InteractiveRobotProps,
} from "./types";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function useMergedEmojis(custom?: InteractiveRobotProps["emojis"]) {
  return useMemo(
    () => ({
      neutral: custom?.neutral ?? DEFAULT_EMOJIS.neutral,
      happy: custom?.happy ?? DEFAULT_EMOJIS.happy,
      angry: custom?.angry ?? DEFAULT_EMOJIS.angry,
      sad: custom?.sad ?? DEFAULT_EMOJIS.sad,
      surprised: custom?.surprised ?? DEFAULT_EMOJIS.surprised,
    }),
    [custom],
  );
}

export function Robot({
  emojis,
  enableElectronCursor = true,
  electronCursorChannel = DEFAULT_POINTER_CHANNEL,
  debugTelemetry,
  onBotClick,
}: InteractiveRobotProps = {}) {
  const mergedEmojis = useMergedEmojis(emojis);

  const groupRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const rightHandRef = useRef<THREE.Mesh>(null);
  const leftEyeGroupRef = useRef<THREE.Group>(null);
  const rightEyeGroupRef = useRef<THREE.Group>(null);

  const [eyeMaterial] = useState(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2,
        toneMapped: false,
      }),
  );

  const emotion: Emotion = "happy";
  const [currentEmoji, setCurrentEmoji] = useState(randomFrom(mergedEmojis.happy));
  const [hovered, setHovered] = useState(false);

  const targetColorRef = useRef(new THREE.Color("#ffffff"));
  const globalPointer = useRef({ x: 0, y: 0 });
  const baseRotationY = useRef(0);
  const clickSpinAngle = useRef(0);
  const clickSpinTarget = useRef(0);
  const blinkTimer = useRef(3);
  const isBlinking = useRef(false);
  const blinkProgress = useRef(0);
  const bobAngle = useRef(0);
  const bobHeight = useRef(0.1);
  const [debugState, setDebugState] = useState({
    pointerX: 0,
    pointerY: 0,
    clicks: 0,
    hovered: false,
  });

  useEffect(() => {
    targetColorRef.current.set("#00e5ff");
    setCurrentEmoji(randomFrom(mergedEmojis.happy));
  }, [mergedEmojis]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const botSize = width >= 640 ? 220 : 160;
      const edgeOffset = 16; // matches Tailwind `bottom-4 right-4`
      const botCenterX = width - edgeOffset - botSize / 2;
      const botCenterY = height - edgeOffset - botSize / 2;
      const trackingRadius = botSize * 1.35;

      // Track relative to the docked bot location, not the viewport center.
      globalPointer.current.x = clamp((event.clientX - botCenterX) / trackingRadius, -1, 1);
      globalPointer.current.y = clamp((event.clientY - botCenterY) / trackingRadius, -1, 1);
      const isNearBot = event.clientX >= width - 280 && event.clientY >= height - 280;
      setHovered(isNearBot);
      setDebugState((prev) => ({
        ...prev,
        pointerX: globalPointer.current.x,
        pointerY: globalPointer.current.y,
        hovered: isNearBot,
      }));
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as { closest?: (selector: string) => Element | null } | null;
      if (target?.closest?.("[data-chat-panel='true']")) {
        return;
      }

      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const isNearBot = event.clientX >= width - 280 && event.clientY >= height - 280;

      if (!isNearBot) {
        return;
      }

      clickSpinTarget.current += Math.PI * 2;
      onBotClick?.();
      setDebugState((prev) => ({
        ...prev,
        clicks: prev.clicks + 1,
      }));
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerdown", handlePointerDown);

    if (
      enableElectronCursor &&
      typeof window !== "undefined" &&
      "require" in window &&
      typeof (window as Window & { require?: unknown }).require === "function"
    ) {
      const electronWindow = window as Window & {
        require: (name: string) => {
          ipcRenderer?: {
            on: (
              channel: string,
              listener: (event: unknown, data: { x: number; y: number }) => void,
            ) => void;
            removeListener: (
              channel: string,
              listener: (event: unknown, data: { x: number; y: number }) => void,
            ) => void;
          };
        };
      };
      const { ipcRenderer } = electronWindow.require("electron");

      if (ipcRenderer) {
        const mouseHandler = (_event: unknown, data: { x: number; y: number }) => {
          globalPointer.current.x = clamp(data.x / 10, -1, 1);
          globalPointer.current.y = clamp(data.y / 10, -1, 1);
        };

        ipcRenderer.on(electronCursorChannel, mouseHandler);

        return () => {
          document.removeEventListener("pointermove", handlePointerMove);
          document.removeEventListener("pointerdown", handlePointerDown);
          ipcRenderer.removeListener(electronCursorChannel, mouseHandler);
        };
      }
    }

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [electronCursorChannel, enableElectronCursor, onBotClick]);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const safeDelta = Math.min(delta, 0.1);
    const targetSpeed = hovered ? 6 : 2;

    bobAngle.current += safeDelta * targetSpeed;
    bobHeight.current = THREE.MathUtils.lerp(bobHeight.current, hovered ? 0.2 : 0.1, safeDelta * 5);

    const bob = Math.sin(bobAngle.current) * bobHeight.current;
    groupRef.current.position.y = bob;

    if (leftHandRef.current && rightHandRef.current) {
      leftHandRef.current.position.y = -0.2 - bob * 1.5;
      rightHandRef.current.position.y = -0.2 - bob * 1.5;
      leftHandRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.1 - Math.PI / 8;
      rightHandRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + Math.PI) * 0.1 + Math.PI / 8;
      leftHandRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2.5) * 0.1;
      rightHandRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2.5 + Math.PI) * 0.1;
    }

    const pointerX = globalPointer.current.x;
    const pointerY = globalPointer.current.y;

    const maxHeadX = Math.PI / 6;
    const maxHeadY = Math.PI / 20;
    const targetX = clamp(pointerX * maxHeadX, -maxHeadX, maxHeadX);
    const targetY = clamp(-pointerY * maxHeadY, -maxHeadY, maxHeadY);

    baseRotationY.current = THREE.MathUtils.lerp(baseRotationY.current, targetX, safeDelta * 6);
    const remainingSpin = clickSpinTarget.current - clickSpinAngle.current;
    // Ease-out toward an exact target so the spin feels alive without overshooting.
    const easing = 1 - Math.exp(-8 * safeDelta);
    clickSpinAngle.current += remainingSpin * easing;
    if (Math.abs(remainingSpin) < 0.002) {
      clickSpinAngle.current = clickSpinTarget.current;
    }

    groupRef.current.rotation.y = baseRotationY.current + clickSpinAngle.current;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -targetY,
      safeDelta * 4,
    );

    blinkTimer.current -= safeDelta;
    if (!isBlinking.current && blinkTimer.current <= 0) {
      isBlinking.current = true;
      blinkProgress.current = 0;
    }

    if (leftEyeGroupRef.current && rightEyeGroupRef.current) {
      if (isBlinking.current) {
        blinkProgress.current = Math.min(blinkProgress.current + safeDelta * 12, 1);
        const closingPhase = blinkProgress.current < 0.5;
        const targetScaleY = closingPhase
          ? THREE.MathUtils.lerp(1, 0.05, blinkProgress.current * 2)
          : THREE.MathUtils.lerp(0.05, 1, (blinkProgress.current - 0.5) * 2);
        leftEyeGroupRef.current.scale.y = THREE.MathUtils.lerp(
          leftEyeGroupRef.current.scale.y,
          targetScaleY,
          safeDelta * 25,
        );
        if (blinkProgress.current >= 1 && leftEyeGroupRef.current.scale.y > 0.95) {
          isBlinking.current = false;
          blinkTimer.current = Math.random() * 3 + 2;
        }
      } else {
        leftEyeGroupRef.current.scale.y = THREE.MathUtils.lerp(
          leftEyeGroupRef.current.scale.y,
          1,
          safeDelta * 25,
        );
      }
      rightEyeGroupRef.current.scale.y = leftEyeGroupRef.current.scale.y;
    }

    eyeMaterial.color.lerp(targetColorRef.current, safeDelta * 10);
    eyeMaterial.emissive.lerp(targetColorRef.current, safeDelta * 10);
  });

  return (
    <group position={[0, -1, 0]}>
      <group ref={groupRef}>
        <group position={[0, 0.4, 0]}>
          <RoundedBox args={[2.2, 2.3, 2.2]} radius={0.9} smoothness={4}>
            <meshStandardMaterial color="#0d0d1a" metalness={0.9} roughness={0.1} />
          </RoundedBox>

          <group position={[0, 0.1, 0.96]}>
            <mesh>
              <capsuleGeometry args={[0.15, 0.4, 16, 16]} />
              <meshStandardMaterial color="#030305" metalness={0.5} roughness={0.4} />
            </mesh>
            <Sphere args={[0.06, 32, 32]} position={[0, 0.2, 0.1]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
            </Sphere>
            <mesh position={[0, -0.15, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.04, 0.02, 16, 32]} />
              <meshStandardMaterial color="#0f0f1c" roughness={0.8} />
            </mesh>
          </group>

          <mesh position={[1.08, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.15, 0.03, 16, 32]} />
            <meshStandardMaterial color="#030305" metalness={0.5} roughness={0.4} />
          </mesh>

          <mesh position={[-1.08, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.15, 0.03, 16, 32]} />
            <meshStandardMaterial color="#030305" metalness={0.5} roughness={0.4} />
          </mesh>

          <mesh ref={leftHandRef} position={[-1.3, -0.2, -0.1]}>
            <capsuleGeometry args={[0.18, 0.35, 32, 32]} />
            <meshStandardMaterial color="#0d0d1a" metalness={0.9} roughness={0.1} />
          </mesh>

          <mesh ref={rightHandRef} position={[1.3, -0.2, -0.1]}>
            <capsuleGeometry args={[0.18, 0.35, 32, 32]} />
            <meshStandardMaterial color="#0d0d1a" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        <group position={[0, 2.3, 0]}>
          <RoundedBox args={[2.5, 1.5, 1.5]} position={[0, 0, 0]} radius={0.5} smoothness={4}>
            <meshStandardMaterial color="#0d0d1a" metalness={0.9} roughness={0.1} />
          </RoundedBox>

          <RoundedBox args={[2.1, 1.1, 0.1]} position={[0, 0, 0.65]} radius={0.2}>
            <meshStandardMaterial color="#050508" metalness={0.5} roughness={0.4} />
          </RoundedBox>

          <group ref={leftEyeGroupRef} position={[-0.45, 0, 0.76]}>
            {emotion === "happy" && (
              <mesh material={eyeMaterial}>
                <torusGeometry args={[0.15, 0.06, 16, 32, Math.PI]} />
              </mesh>
            )}
          </group>

          <group ref={rightEyeGroupRef} position={[0.45, 0, 0.76]}>
            {emotion === "happy" && (
              <mesh material={eyeMaterial}>
                <torusGeometry args={[0.15, 0.06, 16, 32, Math.PI]} />
              </mesh>
            )}
          </group>
        </group>
      </group>
      {debugTelemetry && (
        <Html position={[-1.2, -2.2, 0]} center prepend>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              lineHeight: "1.35",
              color: "#d7f9ff",
              background: "rgba(6, 12, 20, 0.82)",
              border: "1px solid rgba(122, 240, 255, 0.35)",
              borderRadius: "10px",
              padding: "8px 10px",
              minWidth: "140px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <div>{`x: ${debugState.pointerX.toFixed(2)}`}</div>
            <div>{`y: ${debugState.pointerY.toFixed(2)}`}</div>
            <div>{`clicks: ${debugState.clicks}`}</div>
            <div>{`hover: ${debugState.hovered ? "yes" : "no"}`}</div>
          </div>
        </Html>
      )}
    </group>
  );
}
