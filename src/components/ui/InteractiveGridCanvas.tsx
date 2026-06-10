"use client";

import React, { useEffect, useRef } from "react";

interface InteractiveGridCanvasProps {
    className?: string;
    gap?: number;      // Grid gap in pixels (e.g. 24)
    dotSize?: number;  // Base dot size in pixels (e.g. 1)
    activeDotSize?: number; // Dot size when hovered (e.g. 1.8)
    repelRadius?: number; // Mouse repulsion radius (e.g. 130)
    repelStrength?: number; // How strong the repulsion is (e.g. 0.6)
    springTension?: number; // Easing back tension (e.g. 0.04)
    friction?: number; // Damping (e.g. 0.82)
}

interface Dot {
    x0: number; // Original X
    y0: number; // Original Y
    x: number;  // Current X
    y: number;  // Current Y
    vx: number; // Velocity X
    vy: number; // Velocity Y
}

export const InteractiveGridCanvas = ({
    className = "",
    gap = 30,
    dotSize = 1.0,
    activeDotSize = 1.8,
    repelRadius = 160,
    repelStrength = 0.6,
    springTension = 0.04,
    friction = 0.82,
}: InteractiveGridCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const dotsRef = useRef<Dot[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        let isAnimating = false;

        const startAnimating = () => {
            if (!isAnimating) {
                isAnimating = true;
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        // Initialize/Resize Canvas and generate dots
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            const dots: Dot[] = [];
            const cols = Math.ceil(width / gap) + 1;
            const rows = Math.ceil(height / gap) + 1;

            const offsetX = (width % gap) / 2;
            const offsetY = (height % gap) / 2;

            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const x = c * gap + offsetX;
                    const y = r * gap + offsetY;
                    dots.push({
                        x0: x,
                        y0: y,
                        x: x,
                        y: y,
                        vx: 0,
                        vy: 0,
                    });
                }
            }
            dotsRef.current = dots;
            startAnimating();
        };

        resizeCanvas();

        const parent = canvas.parentElement;
        let activeGlowColor = "249, 115, 22"; // default orange fallback

        const updateGlowColor = () => {
            if (typeof window !== "undefined") {
                const bodyStyle = getComputedStyle(document.body);
                const val = bodyStyle.getPropertyValue('--active-glow-color').trim();
                if (val) {
                    activeGlowColor = val;
                }
            }
        };

        updateGlowColor();

        const handleMouseMove = (e: MouseEvent) => {
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            updateGlowColor();
            startAnimating();
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
            startAnimating();
        };

        if (parent) {
            parent.addEventListener("mousemove", handleMouseMove);
            parent.addEventListener("mouseleave", handleMouseLeave);
        }

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        if (parent) resizeObserver.observe(parent);

        // Animation Loop
        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;
            const dots = dotsRef.current;
            const isDark = document.documentElement.classList.contains("dark");

            const baseDotColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(26, 77, 58, 0.22)";
            const repelRadiusSq = repelRadius * repelRadius;

            let needsMoreFrames = false;

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];

                const dx = dot.x - mouse.x;
                const dy = dot.y - mouse.y;
                const distSq = dx * dx + dy * dy;

                let dist = 0;
                let isNearMouse = false;

                // 1. Repulsion physics (move away from cursor)
                if (distSq < repelRadiusSq && distSq > 0) {
                    dist = Math.sqrt(distSq);
                    isNearMouse = true;
                    
                    const force = (repelRadius - dist) / repelRadius;
                    dot.vx += (dx / dist) * force * repelStrength;
                    dot.vy += (dy / dist) * force * repelStrength;
                }

                // 2. Spring force (pull back to base coordinates)
                dot.vx += (dot.x0 - dot.x) * springTension;
                dot.vy += (dot.y0 - dot.y) * springTension;

                // 3. Friction damping
                dot.vx *= friction;
                dot.vy *= friction;

                // 4. Update position
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Check if this dot is still moving
                if (Math.abs(dot.vx) > 0.005 || Math.abs(dot.vy) > 0.005) {
                    needsMoreFrames = true;
                }

                // 5. Draw dot
                ctx.beginPath();
                if (isNearMouse) {
                    const ratio = (repelRadius - dist) / repelRadius; // 1 at mouse, 0 at boundary
                    const currentRadius = dotSize + (activeDotSize - dotSize) * ratio;
                    
                    ctx.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);
                    
                    // Smoothly mix between base dot color and active index color
                    ctx.fillStyle = isDark
                        ? `rgba(${activeGlowColor}, ${0.15 + 0.65 * ratio})`
                        : `rgba(${activeGlowColor}, ${0.22 + 0.58 * ratio})`;
                } else {
                    ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
                    ctx.fillStyle = baseDotColor;
                }
                ctx.fill();
            }

            if (needsMoreFrames) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                isAnimating = false;
            }
        }

        startAnimating();

        // Listen to class changes on <html> (for manual theme toggling)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    updateGlowColor();
                    startAnimating();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        // Listen to system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleThemeChange = () => {
            startAnimating();
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleThemeChange);
        } else {
            mediaQuery.addListener(handleThemeChange);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            observer.disconnect();
            if (parent) {
                parent.removeEventListener("mousemove", handleMouseMove);
                parent.removeEventListener("mouseleave", handleMouseLeave);
            }
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handleThemeChange);
            } else {
                mediaQuery.removeListener(handleThemeChange);
            }
        };
    }, [gap, dotSize, activeDotSize, repelRadius, repelStrength, springTension, friction]);

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
            style={{ display: "block" }}
        />
    );
};
