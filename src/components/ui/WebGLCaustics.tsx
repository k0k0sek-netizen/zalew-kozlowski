"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface WebGLCausticsProps {
    /** RGB string from bite-index-theme e.g. "14, 165, 233" */
    glowColor?: string;
    /** Bite index score 0-100. Controls speed & intensity */
    score?: number;
    className?: string;
}

// ── Shaders ──────────────────────────────────────────────────────────

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color;       // base color RGB 0-1
uniform float u_intensity;  // 0.0 (poor) → 1.0 (excellent)

// ── Pseudo-random hash ──
vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

// ── Voronoi distance field ──
float voronoi(vec2 p, float timeOffset) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float minDist = 1.0;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 o = hash22(i + neighbor);
            // Animate the Voronoi seeds
            o = 0.5 + 0.5 * sin(timeOffset + 6.2831 * o);
            vec2 diff = neighbor + o - f;
            float d = length(diff);
            minDist = min(minDist, d);
        }
    }
    return minDist;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    // Speed: gentle at low scores, energetic at high
    float speed = 0.15 + u_intensity * 0.45;

    // Three layers of caustics at different scales & directions
    float c1 = voronoi(uv * 4.0  + vec2(0.3, 0.7),  u_time * speed * 1.0);
    float c2 = voronoi(uv * 6.5  + vec2(2.1, 1.3),  u_time * speed * 0.7 + 5.0);
    float c3 = voronoi(uv * 10.0 + vec2(4.7, 3.2),  u_time * speed * 0.5 + 10.0);

    // Multiply layers → caustic diamond pattern
    float caustic = c1 * c2 * c3;

    // Shape the falloff — slightly softer (1.8 instead of 2.5) to make lines more defined on mobile screens
    float sharpness = 1.8 - u_intensity * 0.8;
    caustic = pow(caustic, sharpness);

    // Higher brightness boost based on intensity
    float brightness = 1.1 + u_intensity * 0.9;
    caustic *= brightness;

    // ── Color composition ──
    // Richer underwater base (15% color instead of 8% to prevent pure black dead zones)
    vec3 deepBase = u_color * 0.15;
    // Stronger caustic lines in the theme color
    vec3 causticColor = u_color * (1.2 + u_intensity * 0.8);
    // More pronounced white shimmer highlights on the brightest spots
    vec3 highlight = vec3(1.0) * pow(caustic, 2.5) * 0.55;

    vec3 finalColor = deepBase + causticColor * caustic + highlight;

    // Softer vignette (0.4 instead of 0.8) so corners don't get completely washed out on mobile
    vec2 vigUv = gl_FragCoord.xy / u_resolution - 0.5;
    float vignette = 1.0 - dot(vigUv, vigUv) * 0.4;
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// ── Component ────────────────────────────────────────────────────────

export const WebGLCaustics: React.FC<WebGLCausticsProps> = ({
    glowColor = "14, 165, 233",
    score = 50,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const animFrameRef = useRef<number>(0);
    const isVisibleRef = useRef(false);

    // Track active rendering time and last frame timestamp
    const timeRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Parse "R, G, B" string → [r, g, b] normalized 0-1
    const parseColor = useCallback((colorStr: string): [number, number, number] => {
        const parts = colorStr.split(",").map((s) => parseFloat(s.trim()) / 255);
        return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
    }, []);

    // Normalize score to 0-1 intensity
    const intensity = Math.max(0, Math.min(1, score / 100));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: false,
            powerPreference: "low-power",
        });

        if (!gl) {
            // WebGL not supported — fallback to CSS (parent handles this)
            console.warn("[WebGLCaustics] WebGL not available");
            return;
        }
        glRef.current = gl;

        // ── Compile shaders ──
        function compileShader(src: string, type: number): WebGLShader | null {
            const shader = gl!.createShader(type);
            if (!shader) return null;
            gl!.shaderSource(shader, src);
            gl!.compileShader(shader);
            if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
                console.error("[WebGLCaustics] Shader error:", gl!.getShaderInfoLog(shader));
                gl!.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = compileShader(VERTEX_SHADER, gl.VERTEX_SHADER);
        const fs = compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
        if (!vs || !fs) return;

        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("[WebGLCaustics] Link error:", gl.getProgramInfoLog(program));
            return;
        }

        programRef.current = program;
        gl.useProgram(program);

        // ── Full-screen quad ──
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        const aPos = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        // ── Resize handler ──
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for perf
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            gl!.viewport(0, 0, canvas.width, canvas.height);
        };

        resize();

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas.parentElement || canvas);

        // ── Uniform locations ──
        const uTime = gl.getUniformLocation(program, "u_time");
        const uResolution = gl.getUniformLocation(program, "u_resolution");
        const uColor = gl.getUniformLocation(program, "u_color");
        const uIntensity = gl.getUniformLocation(program, "u_intensity");

        // ── Render loop ──
        timeRef.current = 0;
        lastTimeRef.current = 0;

        function render() {
            if (!gl || !isVisibleRef.current) {
                lastTimeRef.current = 0;
                return;
            }

            const now = performance.now();
            if (lastTimeRef.current === 0) {
                lastTimeRef.current = now;
            }
            const delta = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;

            // Accumulate active time, wrapping it to prevent precision issues over long periods
            timeRef.current = (timeRef.current + delta) % 3600;

            gl.uniform1f(uTime, timeRef.current);
            gl.uniform2f(uResolution, canvas!.width, canvas!.height);
            gl.uniform1f(uIntensity, intensity);

            const [r, g, b] = parseColor(glowColor);
            gl.uniform3f(uColor, r, g, b);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animFrameRef.current = requestAnimationFrame(render);
        }

        // ── Visibility observer (pause when off-screen) ──
        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                const wasVisible = isVisibleRef.current;
                isVisibleRef.current = entry.isIntersecting;
                
                if (entry.isIntersecting) {
                    if (!wasVisible) {
                        lastTimeRef.current = 0;
                        cancelAnimationFrame(animFrameRef.current);
                        render();
                    }
                } else {
                    cancelAnimationFrame(animFrameRef.current);
                    lastTimeRef.current = 0;
                }
            },
            { threshold: 0.05 }
        );
        intersectionObserver.observe(canvas);

        render();

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(animFrameRef.current);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.deleteBuffer(buffer);
        };
    }, [glowColor, intensity, parseColor]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full ${className}`}
            style={{ display: "block" }}
        />
    );
};
