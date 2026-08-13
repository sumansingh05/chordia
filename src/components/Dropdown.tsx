"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DropdownProps = {
  trigger: (open: boolean) => ReactNode;
  triggerClassName?: string;
  children: (close: () => void) => ReactNode;
  panelWidth?: number;
  align?: "start" | "end";
};

export default function Dropdown({
  trigger,
  triggerClassName = "",
  children,
  panelWidth = 240,
  align = "start",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let left = align === "start" ? rect.left : rect.right - panelWidth;
    left = Math.max(8, Math.min(left, window.innerWidth - panelWidth - 8));
    let top = rect.bottom + 6;
    const estimatedHeight = 300;
    if (top + estimatedHeight > window.innerHeight) {
      top = Math.max(8, rect.top - estimatedHeight);
    }
    setPos({ top, left });
  }, [open, align, panelWidth]);

  return (
    <div ref={triggerRef} className="inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className={triggerClassName}
      >
        {trigger(open)}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          {pos && (
            <div
              className="fixed z-50 overflow-hidden rounded-xl border border-white/10 bg-[#282828] shadow-2xl"
              style={{ top: pos.top, left: pos.left, width: panelWidth }}
              onClick={(e) => e.stopPropagation()}
            >
              {children(() => setOpen(false))}
            </div>
          )}
        </>
      )}
    </div>
  );
}