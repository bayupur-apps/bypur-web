"use client";

import {
  memo,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type MouseEvent
} from "react";
import "@/styles/magic-bento.css";

export interface MagicBentoItem {
  id?: string | number;
  colSpan?: number;
  rowSpan?: number;
  content?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent) => void;
  title?: string;
}

export interface MagicBentoProps {
  items?: MagicBentoItem[];
  columns?: number;
  gap?: number;
  radius?: number;
  spotlightRadius?: number;
  enableBorderGlow?: boolean;
  enableSpotlight?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  intro?: boolean;
  disableAnimations?: boolean;
  onItemClick?: (item: MagicBentoItem, index: number) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const TILT = 5;
const MAGNET = 4;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const MagicBento = memo(function MagicBento({
  items = [],
  columns = 4,
  gap = 10,
  radius = 14,
  spotlightRadius = 300,
  enableBorderGlow = true,
  enableSpotlight = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  intro = false,
  disableAnimations = false,
  onItemClick,
  className = "",
  style
}: Readonly<MagicBentoProps>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const settings = {
    columns: Math.max(1, Math.round(columns)),
    gap: Math.max(0, gap),
    enableBorderGlow,
    enableSpotlight,
    spotlightRadius: Math.max(40, spotlightRadius),
    enableTilt,
    enableMagnetism,
    clickEffect,
    intro,
    disableAnimations
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion = !settingsRef.current.disableAnimations && !reduced;

    const pointer = { x: -1e5, y: -1e5, inside: false, down: -1 };
    const light = { x: -1e5, y: -1e5, near: 0, ready: false };
    const states: {
      hot: number;
      rx: number;
      ry: number;
      tx: number;
      ty: number;
      vrx: number;
      vry: number;
      vtx: number;
      vty: number;
      press: number;
      vpress: number;
      active: boolean;
      written: Record<string, string>;
    }[] = [];
    const wave = { x: 0, y: 0, t: -1, duration: 1.0, reach: 800 };
    let rects: (DOMRect | null)[] = [];
    let bounds: DOMRect | null = null;
    let dirty = true;
    let raf = 0;
    let last = 0;
    let visible = true;

    const stateFor = (index: number) => {
      if (!states[index]) {
        states[index] = {
          hot: 0,
          rx: 0,
          ry: 0,
          tx: 0,
          ty: 0,
          vrx: 0,
          vry: 0,
          vtx: 0,
          vty: 0,
          press: 1,
          vpress: 0,
          active: false,
          written: {}
        };
      }
      return states[index];
    };

    const write = (element: HTMLElement, state: ReturnType<typeof stateFor>, name: string, value: string) => {
      if (state.written[name] === value) return;
      state.written[name] = value;
      element.style.setProperty(name, value);
    };

    const measure = () => {
      dirty = false;
      bounds = root.getBoundingClientRect();
      rects = cellRefs.current.map((cell) => (cell ? cell.getBoundingClientRect() : null));
    };

    const startWave = (x: number, y: number, duration: number) => {
      if (!motion || !bounds) return;
      wave.x = x;
      wave.y = y;
      wave.t = 0;
      wave.duration = duration;
      wave.reach =
        Math.max(
          Math.hypot(x - bounds.left, y - bounds.top),
          Math.hypot(x - bounds.right, y - bounds.top),
          Math.hypot(x - bounds.left, y - bounds.bottom),
          Math.hypot(x - bounds.right, y - bounds.bottom)
        ) + 120;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (dirty) measure();
      const s = settingsRef.current;
      const cards = cardRefs.current;
      let busy = false;

      const margin = s.spotlightRadius * 0.5;
      const near =
        pointer.inside &&
        bounds &&
        pointer.x > bounds.left - margin &&
        pointer.x < bounds.right + margin &&
        pointer.y > bounds.top - margin &&
        pointer.y < bounds.bottom + margin
          ? 1
          : 0;

      if (!light.ready && near) {
        light.x = pointer.x;
        light.y = pointer.y;
        light.ready = true;
      }
      const follow = 1 - Math.exp(-dt / 0.05);
      light.x += (pointer.x - light.x) * follow;
      light.y += (pointer.y - light.y) * follow;
      const fade = 1 - Math.exp(-dt / (near > light.near ? 0.12 : 0.4));
      light.near += (near - light.near) * fade;
      if (Math.abs(near - light.near) < 0.002) light.near = near;
      else busy = true;
      if (Math.abs(pointer.x - light.x) + Math.abs(pointer.y - light.y) > 0.3) busy = true;

      let waveRadius = 0;
      let waveAlpha = 0;
      if (wave.t >= 0) {
        wave.t += dt;
        const progress = Math.min(1, wave.t / wave.duration);
        waveRadius = wave.reach * (1 - Math.pow(1 - progress, 2.2));
        waveAlpha = Math.pow(1 - progress, 1.3);
        if (progress >= 1) {
          wave.t = -1;
          waveAlpha = 0;
        } else busy = true;
      }

      cards.forEach((card, index) => {
        const rect = rects[index];
        if (!card || !rect) return;
        const state = stateFor(index);
        const lx = light.x - rect.left;
        const ly = light.y - rect.top;
        const px = pointer.x - rect.left;
        const py = pointer.y - rect.top;
        const inside = pointer.inside && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;

        if (inside !== state.active) {
          state.active = inside;
        }

        const hotTarget = inside && s.enableSpotlight ? 1 : 0;
        state.hot += (hotTarget - state.hot) * (1 - Math.exp(-dt / (hotTarget > state.hot ? 0.14 : 0.32)));
        if (Math.abs(hotTarget - state.hot) < 0.002) state.hot = hotTarget;
        else busy = true;

        const u = clamp(px / Math.max(1, rect.width), 0, 1) - 0.5;
        const v = clamp(py / Math.max(1, rect.height), 0, 1) - 0.5;
        const tilt = inside && s.enableTilt && motion;
        const magnet = inside && s.enableMagnetism && motion;
        const targets = [
          tilt ? -v * 2 * TILT : 0,
          tilt ? u * 2 * TILT : 0,
          magnet ? u * 2 * MAGNET : 0,
          magnet ? v * 2 * MAGNET : 0
        ];
        const keys: ["rx" | "ry" | "tx" | "ty", "vrx" | "vry" | "vtx" | "vty"][] = [
          ["rx", "vrx"],
          ["ry", "vry"],
          ["tx", "vtx"],
          ["ty", "vty"]
        ];
        const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
        const h = dt / steps;
        keys.forEach(([key, velocity], k) => {
          for (let step = 0; step < steps; step++) {
            state[velocity] += (170 * (targets[k] - state[key]) - 20 * state[velocity]) * h;
            state[key] += state[velocity] * h;
          }
          if (Math.abs(targets[k] - state[key]) < 0.002 && Math.abs(state[velocity]) < 0.01) {
            state[key] = targets[k];
            state[velocity] = 0;
          } else busy = true;
        });

        const pressTarget = pointer.down === index && s.clickEffect && motion ? 0.99 : 1;
        for (let step = 0; step < steps; step++) {
          state.vpress += (420 * (pressTarget - state.press) - 28 * state.vpress) * h;
          state.press += state.vpress * h;
        }
        if (Math.abs(pressTarget - state.press) < 0.0002 && Math.abs(state.vpress) < 0.001) {
          state.press = pressTarget;
          state.vpress = 0;
        } else busy = true;

        write(card, state, "--mb-x", `${lx.toFixed(1)}px`);
        write(card, state, "--mb-y", `${ly.toFixed(1)}px`);
        write(card, state, "--mb-near", (s.enableBorderGlow ? light.near : 0).toFixed(3));
        write(card, state, "--mb-hot", state.hot.toFixed(3));
        write(card, state, "--mb-rx", `${state.rx.toFixed(3)}deg`);
        write(card, state, "--mb-ry", `${state.ry.toFixed(3)}deg`);
        write(card, state, "--mb-tx", `${state.tx.toFixed(2)}px`);
        write(card, state, "--mb-ty", `${state.ty.toFixed(2)}px`);
        write(card, state, "--mb-press", state.press.toFixed(4));
        write(card, state, "--mb-wx", `${(wave.x - rect.left).toFixed(1)}px`);
        write(card, state, "--mb-wy", `${(wave.y - rect.top).toFixed(1)}px`);
        write(card, state, "--mb-wr", `${waveRadius.toFixed(1)}px`);
        write(card, state, "--mb-wa", waveAlpha.toFixed(3));
      });

      if (busy && visible) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const cardIndex = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return -1;
      const card = target.closest(".magic-bento__card");
      return card instanceof HTMLDivElement ? cardRefs.current.indexOf(card) : -1;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      wake();
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      pointer.inside = false;
      pointer.down = -1;
      wake();
    };

    const onPointerDown = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      pointer.down = cardIndex(event.target);
      wake();
    };

    const release = () => {
      if (pointer.down < 0) return;
      pointer.down = -1;
      wake();
    };

    const activate = (x: number, y: number) => {
      if (settingsRef.current.clickEffect) {
        if (dirty) measure();
        startWave(x, y, 1.0);
      }
      wake();
    };

    const onClick = (event: MouseEvent<HTMLDivElement> | globalThis.MouseEvent) => {
      if (event.detail === 0 && bounds) {
        activate(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      } else {
        activate(event.clientX, event.clientY);
      }
    };

    const onScroll = () => {
      dirty = true;
      wake();
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        dirty = true;
        wake();
      });
      resizeObserver.observe(root);
    }

    let visibility: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      visibility = new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          dirty = true;
          wake();
        }
      });
      visibility.observe(root);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    root.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      visibility?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointerout", onPointerOut);
      root.removeEventListener("click", onClick);
    };
  }, []);

  const corner = Math.max(0, radius);

  cellRefs.current.length = items.length;
  cardRefs.current.length = items.length;

  return (
    <div
      ref={rootRef}
      className={`magic-bento ${className}`.trim()}
      style={{
        "--mb-radius": `${corner}px`,
        "--mb-spot-size": `${Math.max(40, spotlightRadius)}px`,
        "--mb-border-size": `${Math.round(Math.max(40, spotlightRadius) * 0.75)}px`,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${Math.max(0, gap)}px`,
        ...style
      } as unknown as CSSProperties}
    >
      {items.map((item, index) => {
        const entry = item ?? {};
        const cardProps = {
          ref: (element: HTMLDivElement | null) => {
            cardRefs.current[index] = element;
          },
          className: `magic-bento__card ${entry.className || ""}`.trim(),
          onClick: (e: MouseEvent<HTMLDivElement>) => {
            entry.onClick?.(e);
            onItemClick?.(entry, index);
          }
        };

        const colSpanClass = entry.colSpan ? `span ${entry.colSpan}` : undefined;
        const rowSpanClass = entry.rowSpan ? `span ${entry.rowSpan}` : undefined;

        return (
          <div
            key={entry.id ?? index}
            ref={(element) => {
              cellRefs.current[index] = element;
            }}
            className="magic-bento__cell"
            style={{
              gridColumn: colSpanClass,
              gridRow: rowSpanClass
            }}
          >
            <div {...cardProps}>
              {enableSpotlight && <span className="magic-bento__light" />}
              <div className="magic-bento__content">{entry.content}</div>
              <span className="magic-bento__rim" />
              <span className="magic-bento__border" />
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default MagicBento;
