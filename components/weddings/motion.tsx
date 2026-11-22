"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ParallaxLayer, SceneAccents, SignatureFlags } from "@/lib/weddings/template-experience";

const SignatureContext = createContext<SignatureFlags | null>(null);

export interface MotionScene {
  signature: SignatureFlags;
  parallaxLayers: ParallaxLayer[];
  parallaxScrim: "dark" | "light" | "none";
  accents: SceneAccents;
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
