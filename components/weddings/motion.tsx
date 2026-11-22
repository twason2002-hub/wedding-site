"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SignatureFlags } from "@/lib/weddings/template-experience";

const SignatureContext = createContext<SignatureFlags | null>(null);

export function WeddingMotionProvider({
  value,
  children,
}: {
  value: SignatureFlags;
  children: ReactNode;
}) {
  return <SignatureContext.Provider value={value}>{children}</SignatureContext.Provider>;
}

export function useSignature(): SignatureFlags | null {
  return useContext(SignatureContext);
}
