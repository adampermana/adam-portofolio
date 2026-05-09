"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

type CardTransform = {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
};

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => (
  <div
    className={`scroll-stack-card relative my-8 h-80 w-full origin-top rounded-[40px] p-12 shadow-[0_0_30px_rgba(0,0,0,0.1)] will-change-transform ${itemClassName}`.trim()}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, CardTransform>());

  // ─── Store all props in a ref so callbacks never need to be recreated ───────
  const propsRef = useRef({
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
  });

  // Keep propsRef in sync without causing re-renders
  useEffect(() => {
    propsRef.current = {
      itemDistance,
      itemScale,
      itemStackDistance,
      stackPosition,
      scaleEndPosition,
      baseScale,
      rotationAmount,
      blurAmount,
      useWindowScroll,
      onStackComplete,
    };
  });

  // ─── Cache of card top offsets (recalculated on resize) ──────────────────────
  const cardOffsetsRef = useRef<number[]>([]);
  const endOffsetRef = useRef<number>(0);

  const recalcOffsets = useCallback(() => {
    const { useWindowScroll } = propsRef.current;
    const cards = cardsRef.current;
    const root = rootRef.current;
    if (!cards.length || !root) return;

    if (useWindowScroll) {
      cardOffsetsRef.current = cards.map(
        (c) => c.getBoundingClientRect().top + window.scrollY,
      );
      const end = root.querySelector(".scroll-stack-end") as HTMLElement | null;
      endOffsetRef.current = end
        ? end.getBoundingClientRect().top + window.scrollY
        : 0;
    } else {
      cardOffsetsRef.current = cards.map((c) => c.offsetTop);
      const end = root.querySelector(".scroll-stack-end") as HTMLElement | null;
      endOffsetRef.current = end ? end.offsetTop : 0;
    }
  }, []);

  // ─── Core transform update — stable reference, reads from refs ───────────────
  const updateCardTransforms = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const {
      itemScale,
      itemStackDistance,
      stackPosition,
      scaleEndPosition,
      baseScale,
      rotationAmount,
      blurAmount,
      useWindowScroll,
      onStackComplete,
    } = propsRef.current;

    const scrollTop = useWindowScroll
      ? window.scrollY
      : (scrollerRef.current?.scrollTop ?? 0);
    const containerHeight = useWindowScroll
      ? window.innerHeight
      : (scrollerRef.current?.clientHeight ?? 0);

    // Parse "20%" → pixels
    const parsePx = (v: string | number) => {
      if (typeof v === "string" && v.includes("%"))
        return (parseFloat(v) / 100) * containerHeight;
      return parseFloat(String(v));
    };

    const stackPositionPx = parsePx(stackPosition);
    const scaleEndPositionPx = parsePx(scaleEndPosition);
    const endElementTop = endOffsetRef.current;
    const offsets = cardOffsetsRef.current;

    cards.forEach((card, index) => {
      if (!card) return;

      const cardTop = offsets[index] ?? 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * index;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinEnd = endElementTop - containerHeight / 2;

      // ── Scale ──
      let scaleProgress = 0;
      if (scrollTop > triggerStart && triggerEnd > triggerStart) {
        scaleProgress = Math.min(
          1,
          (scrollTop - triggerStart) / (triggerEnd - triggerStart),
        );
      }
      const targetScale = baseScale + index * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      // ── Rotation ──
      const rotation = rotationAmount
        ? index * rotationAmount * scaleProgress
        : 0;

      // ── Blur ──
      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let i = 0; i < cards.length; i++) {
          const o = offsets[i] ?? 0;
          if (scrollTop >= o - stackPositionPx - itemStackDistance * i)
            topCardIndex = i;
        }
        if (index < topCardIndex)
          blur = Math.max(0, (topCardIndex - index) * blurAmount);
      }

      // ── Pin / translateY ──
      let translateY = 0;
      const pinStart = triggerStart;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY =
          scrollTop - cardTop + stackPositionPx + itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY =
          pinEnd - cardTop + stackPositionPx + itemStackDistance * index;
      }

      const next: CardTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 10000) / 10000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const prev = lastTransformsRef.current.get(index);
      const dirty =
        !prev ||
        Math.abs(prev.translateY - next.translateY) > 0.05 ||
        Math.abs(prev.scale - next.scale) > 0.0001 ||
        Math.abs(prev.rotation - next.rotation) > 0.05 ||
        Math.abs(prev.blur - next.blur) > 0.05;

      if (dirty) {
        // Single transform string — no backface / preserve-3d needed
        card.style.transform = rotation
          ? `translate3d(0,${next.translateY}px,0) scale(${next.scale}) rotate(${next.rotation}deg)`
          : `translate3d(0,${next.translateY}px,0) scale(${next.scale})`;

        if (blurAmount) {
          card.style.filter =
            next.blur > 0 ? `blur(${next.blur}px)` : "none";
        }

        lastTransformsRef.current.set(index, next);
      }

      // ── Stack-complete callback ──
      if (index === cards.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, []); // ← intentionally empty: all data comes from refs

  // ─── One-time setup ──────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".scroll-stack-card"),
    );
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    const { itemDistance, useWindowScroll } = propsRef.current;

    cards.forEach((card, index) => {
      if (index < cards.length - 1)
        card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = "transform";
      card.style.transformOrigin = "top center";
      // Reset any browser-default stacking context hacks
      card.style.backfaceVisibility = "visible";
      card.style.transformStyle = "flat";
    });

    // Calculate offsets before Lenis init
    recalcOffsets();

    // ── Lenis setup ──
    const baseOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    };

    const lenis = useWindowScroll
      ? new Lenis(baseOptions)
      : new Lenis({
          ...baseOptions,
          wrapper: scrollerRef.current ?? undefined,
          content: (scrollerRef.current?.querySelector(
            ".scroll-stack-inner",
          ) as HTMLElement) ?? undefined,
        });

    // Lenis fires on every smoothed scroll tick — no separate RAF listener needed
    lenis.on("scroll", updateCardTransforms);

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    // Initial paint
    updateCardTransforms();

    // ── Resize: recalc offsets then re-paint ──
    const onResize = () => {
      recalcOffsets();
      updateCardTransforms();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      stackCompletedRef.current = false;
      transformsCache.clear();
      cardOffsetsRef.current = [];
    };
  }, [recalcOffsets, updateCardTransforms]);

  return (
    <div
      ref={rootRef}
      className={[
        "relative w-full overflow-x-visible",
        useWindowScroll ? "" : "h-full overflow-y-auto",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ overscrollBehavior: "contain" }}
    >
      <div ref={scrollerRef} className={useWindowScroll ? "" : "h-full"}>
        <div className="scroll-stack-inner min-h-screen pb-[42rem] pt-[16vh]">
          {children}
          <div className="scroll-stack-end h-px w-full" />
        </div>
      </div>
    </div>
  );
};

export default ScrollStack;
