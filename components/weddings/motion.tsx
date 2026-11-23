"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DELIGHT_OFF,
  type DelightFlags,
  type ParallaxLayer,
  type SceneAccents,
  type SignatureFlags,
} from "@/lib/weddings/template-experience";

const SignatureContext = createContext<SignatureFlags | null>(null);

export interface MotionScene {
  signature: SignatureFlags;
  parallaxLayers: ParallaxLayer[];
  parallaxScrim: "dark" | "light" | "palace" | "coast" | "none";
  accents: SceneAccents;
  delight: DelightFlags;
}

const SceneContext = createContext<MotionScene | null>(null);

export function WeddingMotionProvider({
  scene,
  children,
}: {
  scene: MotionScene;
  children: ReactNode;
}) {
  return (
    <SignatureContext.Provider value={scene.signature}>
      <SceneContext.Provider value={scene}>{children}</SceneContext.Provider>
    </SignatureContext.Provider>
  );
}

export function useSignature(): SignatureFlags | null {
  return useContext(SignatureContext);
}

export function useMotionScene(): MotionScene | null {
  return useContext(SceneContext);
}

export function useDelight(): DelightFlags {
  return useMotionScene()?.delight ?? DELIGHT_OFF;
}
