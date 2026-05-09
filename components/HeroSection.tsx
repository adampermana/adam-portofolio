"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GitHubIcon from "./GitHubIcon";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const frameCount = 80;

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i += 1) {
      const img = new Image();
      img.src = `/astronout/astronout-frame---${i}.jpg`;

      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === frameCount) {
          setImages(loadedImages);

          if (canvasRef.current && loadedImages[0]) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              canvasRef.current.width = loadedImages[0].width;
              canvasRef.current.height = loadedImages[0].height;
              ctx.drawImage(loadedImages[0], 0, 0);
            }
          }
        }
      };

      loadedImages.push(img);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 0.92, 0.18]);
  const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const horizonOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.12]);

  useEffect(() => {
    const unsubscribe = frameIndex.on("change", (latest) => {
      if (images.length === frameCount && canvasRef.current) {
        const index = Math.round(latest);
        const img = images[index];
        const ctx = canvasRef.current.getContext("2d");

        if (ctx && img) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        }
      }
    });

    return () => unsubscribe();
  }, [frameIndex, images]);

  return (
    <section id="home" ref={containerRef} className="relative h-[300vh] bg-space-black">
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <motion.div
          aria-hidden="true"
          style={{ y: starsY }}
          className="star-field absolute inset-0 opacity-[0.32]"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-75 mix-blend-screen"
        />

        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_64%_42%,rgba(59,167,255,0.14),transparent_34%),linear-gradient(90deg,#02040A_0%,rgba(2,4,10,0.72)_36%,rgba(2,4,10,0.18)_64%,#02040A_100%)]" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-space-black via-transparent to-space-black/90" />
        <motion.div
          aria-hidden="true"
          style={{ opacity: horizonOpacity }}
          className="absolute inset-x-0 bottom-0 z-0 h-44 bg-gradient-to-t from-atm-blue/20 to-transparent"
        />

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-20 md:px-12"
        >
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-gray-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              Mobile App Developer / East Jakarta
            </div>

            <p className="mb-5 font-orbitron text-xs font-semibold uppercase tracking-[0.36em] text-atm-blue/80">
              Portfolio / 2026
            </p>
            <h1 className="font-orbitron text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-6xl md:text-8xl lg:text-9xl">
              Adam
              <span className="block text-white/[0.55]">Permana</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
              I build polished mobile applications with Flutter, thoughtful
              interface systems, and production-minded execution from first
              screen to shipped product.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="/cv-adam-permana.pdf"
                download
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-soft-white px-6 py-3 text-sm font-semibold text-space-black transition duration-300 hover:bg-atm-blue"
              >
                Download CV
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="https://github.com/adampermana"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:border-white/[0.25] hover:bg-white/[0.07]"
              >
                <GitHubIcon className="h-4 w-4" />
                GitHub Profile
              </a>
            </div>

            <div className="mt-12 text-xs uppercase tracking-[0.28em] text-gray-500">
              Scroll to explore work
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
