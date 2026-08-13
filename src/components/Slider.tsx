"use client";

import { useCallback, useRef, type PointerEvent } from "react";

type SliderProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
};

export default function Slider({
  value,
  max,
  onChange,
  className = "",
  disabled = false,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const valueFromEvent = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const el = trackRef.current;
      if (!el || max <= 0) return 0;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      return ratio * max;
    },
    [max]
  );

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    onChange(valueFromEvent(e));
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || !draggingRef.current) return;
    onChange(valueFromEvent(e));
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  return (
    <div
      className={`group relative flex h-5 items-center cursor-pointer select-none touch-none ${className}`}
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled}
    >
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white/80 transition-[width] duration-75 group-hover:bg-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}
