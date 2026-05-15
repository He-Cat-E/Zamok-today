"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  try {
    const raw = window.localStorage.getItem("zamok_theme");
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
    return "system";
  } catch {
    return "system";
  }
}

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyHtmlTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  if (resolved === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

function applyFavicon() {
  const href = "/icon.png";
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"], link[rel="shortcut icon"]')
  );
  if (links.length === 0) {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    document.head.appendChild(link);
    return;
  }
  for (const l of links) l.href = href;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const m = readStoredMode();
    setModeState(m);
    const r = resolveMode(m);
    setResolved(r);
    applyHtmlTheme(r);
    applyFavicon();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("zamok_theme", mode);
    } catch {
      // ignore
    }
    const r = resolveMode(mode);
    setResolved(r);
    applyHtmlTheme(r);
    applyFavicon();
    window.dispatchEvent(new Event("zamok:theme-change"));
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const onChange = () => {
      const r = resolveMode("system");
      setResolved(r);
      applyHtmlTheme(r);
      applyFavicon();
    };
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      mode,
      resolved,
      setMode: (m) => setModeState(m),
      toggle: () => setModeState((prev) => (resolveMode(prev) === "dark" ? "light" : "dark"))
    };
  }, [mode, resolved]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

