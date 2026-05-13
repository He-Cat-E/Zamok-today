"use client";

import { JetBrains_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { manrope } from "@/theme/fonts";
import styles from "./HomeInitialLoader.module.css";

/** Loader (and bar 1→100%) stays for at least this long before fade-out. */
const MIN_LOAD_MS = 3000;
/** Allow opacity transition to finish before unmounting (see `.shell` CSS). */
const FADE_OUT_MS = 480;

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hloader-mono"
});

function randomNodeId() {
  const hex = () => Math.floor(Math.random() * 16).toString(16).toUpperCase();
  return Array.from({ length: 6 }, hex).join("");
}

type Drop = {
  x: number;
  y: number;
  s: number;
  l: number;
  h: "cyan" | "red";
};

type Arc = { x1: number; y1: number; x2: number; y2: number; t: number };

export function HomeInitialLoader() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const dropsRef = useRef<Drop[]>([]);
  const arcsRef = useRef<Arc[]>([]);
  const W = useRef(0);
  const H = useRef(0);

  const [sessionKey, setSessionKey] = useState(0);
  const [gone, setGone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [nodeId, setNodeId] = useState("");
  const [clock, setClock] = useState("--:--:--");
  const [year, setYear] = useState("");
  const [progress, setProgress] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const reduceMotionRef = useRef(false);
  const dismissedRef = useRef(false);

  useLayoutEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    setSessionKey((k) => k + 1);
    setGone(false);
    setFadeOut(false);
    setProgress(1);
    dismissedRef.current = false;
    setNodeId(randomNodeId());
  }, [pathname]);

  useLayoutEffect(() => {
    setNodeId(randomNodeId());
    setYear(String(new Date().getFullYear()));
    try {
      reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduceMotionRef.current = false;
    }
    setReduceMotion(reduceMotionRef.current);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotionRef.current = mq.matches;
      setReduceMotion(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (gone) return;
    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [gone, sessionKey]);

  const runCanvas = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv || reduceMotion) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      W.current = window.innerWidth;
      H.current = window.innerHeight;
      cv.width = W.current * dpr;
      cv.height = H.current * dpr;
      cv.style.width = `${W.current}px`;
      cv.style.height = `${H.current}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dropsRef.current = [];
      const cnt = Math.floor(W.current / 50);
      for (let i = 0; i < cnt; i++) {
        dropsRef.current.push({
          x: Math.random() * W.current,
          y: Math.random() * H.current,
          s: 0.35 + Math.random() * 0.65,
          l: 60 + Math.random() * 120,
          h: Math.random() < 0.15 ? "cyan" : "red"
        });
      }
    };

    const spawnArc = () => {
      if (arcsRef.current.length > 4) return;
      arcsRef.current.push({
        x1: Math.random() * W.current,
        y1: Math.random() * H.current,
        x2: Math.random() * W.current,
        y2: Math.random() * H.current,
        t: 0
      });
    };

    const frame = () => {
      const w = W.current;
      const h = H.current;
      ctx.clearRect(0, 0, w, h);
      for (const d of dropsRef.current) {
        d.y += d.s;
        if (d.y > h + d.l) {
          d.y = -d.l;
          d.x = Math.random() * w;
        }
        const c = d.h === "cyan" ? "92,230,255" : "195,44,43";
        const lg = ctx.createLinearGradient(d.x, d.y - d.l, d.x, d.y);
        lg.addColorStop(0, `rgba(${c},0)`);
        lg.addColorStop(1, `rgba(${c},.45)`);
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.l);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${c},.9)`;
        ctx.fillRect(d.x - 0.5, d.y - 1, 1.5, 2);
      }
      if (Math.random() < 0.015) spawnArc();
      for (let i = arcsRef.current.length - 1; i >= 0; i--) {
        const a = arcsRef.current[i];
        a.t += 0.012;
        if (a.t > 1) {
          arcsRef.current.splice(i, 1);
          continue;
        }
        const x = a.x1 + (a.x2 - a.x1) * a.t;
        const y = a.y1 + (a.y2 - a.y1) * a.t;
        const fade = Math.sin(a.t * Math.PI);
        ctx.strokeStyle = `rgba(195,44,43,${(0.18 * fade).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x1, a.y1);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = `rgba(195,44,43,${(0.85 * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    size();
    window.addEventListener("resize", size);
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("resize", size);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (gone || reduceMotion) return;
    return runCanvas();
  }, [gone, sessionKey, reduceMotion, runCanvas]);

  useEffect(() => {
    if (gone) return;

    const started = performance.now();
    const timers: number[] = [];
    let rafId = 0;
    let cancelled = false;

    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const step = () => {
      if (cancelled) return;
      const elapsed = performance.now() - started;
      const u = Math.min(1, elapsed / MIN_LOAD_MS);
      const rm = reduceMotionRef.current;
      const eased = rm ? u : easeOutCubic(u);
      const value = 1 + 99 * eased;

      if (elapsed < MIN_LOAD_MS) {
        setProgress(value);
        rafId = requestAnimationFrame(step);
        return;
      }

      setProgress(100);
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setFadeOut(true);
        }, 0) as unknown as number
      );
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      dismissedRef.current = false;
      cancelAnimationFrame(rafId);
      for (const t of timers) clearTimeout(t);
    };
  }, [gone, sessionKey]);

  useEffect(() => {
    if (gone || !fadeOut) return;
    const t = window.setTimeout(() => setGone(true), FADE_OUT_MS);
    return () => clearTimeout(t);
  }, [fadeOut, gone]);

  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gone, sessionKey]);

  if (gone) return null;

  const pct = Math.round(progress);

  return (
    <div
      className={`${manrope.variable} ${mono.variable} ${styles.shell} ${fadeOut ? styles.shellFadeOut : ""}`}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Loading"
    >
      {!reduceMotion && <canvas ref={canvasRef} className={styles.canvas} aria-hidden={true} />}
      <div className={styles.scan} aria-hidden />

      <span className={`${styles.bracket} ${styles.tl}`} aria-hidden />
      <span className={`${styles.bracket} ${styles.tr}`} aria-hidden />
      <span className={`${styles.bracket} ${styles.bl}`} aria-hidden />
      <span className={`${styles.bracket} ${styles.br}`} aria-hidden />

      <div className={styles.wrap}>
        <header className={styles.top}>
          <div className={styles.id}>
            <span className={styles.led} aria-hidden />
            NODE <b>{nodeId || "------"}</b>
          </div>
          <div className={styles.clock}>
            UPLINK · <b>{clock}</b>
          </div>
        </header>

        <main className={styles.hero}>
          <div className={styles.stamp}>SISTEM HAZIRLANIYOR</div>

          <h1 className={styles.logo} aria-label="ZAMOK">
            <span>Z</span>
            <span>A</span>
            <span className={styles.glitch}>M</span>
            <span>O</span>
            <span>K</span>
          </h1>

          <div className={styles.underline} aria-hidden />

          <p className={styles.tag}>
            Yeni nesil <b>kurumsal teknoloji altyapısı</b>
            <br />
            çok yakında çevrimiçi.
          </p>

          <div className={styles.soon}>
            ÇOK YAKINDA
            <span className={styles.dots} aria-hidden>
              <i />
              <i />
              <i />
            </span>
          </div>

          <div className={styles.progress}>
            <div className={styles.progressLabel}>
              <span>BUILD STATUS</span> <b>{pct}%</b>
            </div>
            <div className={styles.bar}>
              <div className={styles.fill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </main>

        <footer className={styles.foot}>
          <div className={styles.contact}>
            <span className={styles.lbl}>İLETİŞİM</span>
            <a href="mailto:info@zamok.com.tr">info@zamok.com.tr</a>
            <a href="https://zamok.com.tr">zamok.com.tr</a>
          </div>
          <div className={styles.meta}>
            <div>
              © {year || "—"} ZAMOK · ALL SYSTEMS NOMINAL
            </div>
            <div>
              SECURE CHANNEL · <b>TLS 1.3</b>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
