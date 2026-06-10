"use client";
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform sampler2D u_texture;
  uniform vec3 u_ripples[16]; // x, y, age
  uniform int u_ripple_count;
  varying vec2 v_texCoord;

  void main() {
    vec2 uv = v_texCoord;
    // Fix aspect ratio for distance calculations
    vec2 p = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    
    vec2 offset = vec2(0.0);
    
    for(int i = 0; i < 16; i++) {
        if (i >= u_ripple_count) break;
        vec2 center = u_ripples[i].xy / u_resolution.xy;
        center.y = 1.0 - center.y; // flip y
        
        float age = u_ripples[i].z;
        
        vec2 dir = p - center;
        dir.x *= aspect;
        
        float dist = length(dir);
        float radius = age * 0.8; // wave speed
        
        // Ring width
        float width = 0.05 + age * 0.1;
        
        if (dist < radius && dist > radius - width) {
            float diff = (dist - radius) / width;
            // sin wave with damping
            float wave = sin(diff * 3.14159 * 2.0) * exp(-age * 3.0);
            dir.x /= aspect; // un-aspect for uv offset
            offset += normalize(dir) * wave * 0.02 * (1.0 - age/3.0);
        }
    }
    
    gl_FragColor = texture2D(u_texture, uv + offset);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface RippleBackgroundProps {
  className?: string;
  imageUrl: string;
}

export const WaterRippleBackground = ({ className, imageUrl }: RippleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<{x: number, y: number, age: number}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) return;

    // Shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,  1.0, -1.0,  -1.0,  1.0,
      -1.0,  1.0,  1.0, -1.0,   1.0,  1.0
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 1.0,  1.0, 1.0,  0.0, 0.0,
      0.0, 0.0,  1.0, 1.0,  1.0, 0.0
    ]), gl.STATIC_DRAW);

    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const ripplesLoc = gl.getUniformLocation(program, "u_ripples");
    const countLoc = gl.getUniformLocation(program, "u_ripple_count");

    // Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    let imageLoaded = false;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      imageLoaded = true;
    };

    // Resize
    const resize = () => {
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse Interaction
    let lastMouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
        const dist = Math.hypot(e.clientX - lastMouse.x, e.clientY - lastMouse.y);
        if (dist > 30) {
            ripplesRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
            if (ripplesRef.current.length > 16) ripplesRef.current.shift();
            lastMouse = { x: e.clientX, y: e.clientY };
        }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    let reqId: number;
    let lastTime = performance.now();
    
    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (imageLoaded) {
          // Update ripples
          for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
              ripplesRef.current[i].age += dt;
              if (ripplesRef.current[i].age > 3.0) {
                  ripplesRef.current.splice(i, 1);
              }
          }

          // Pass ripples to shader
          const flatRipples = new Float32Array(16 * 3);
          for (let i = 0; i < ripplesRef.current.length; i++) {
              flatRipples[i*3] = ripplesRef.current[i].x;
              flatRipples[i*3+1] = ripplesRef.current[i].y;
              flatRipples[i*3+2] = ripplesRef.current[i].age;
          }
          
          gl.uniform3fv(ripplesLoc, flatRipples);
          gl.uniform1i(countLoc, ripplesRef.current.length);

          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      reqId = requestAnimationFrame(render);
    };
    reqId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(reqId);
      gl.deleteProgram(program);
    };
  }, [imageUrl]);

  return (
    <canvas 
      ref={canvasRef} 
      className={cn("absolute inset-0 w-full h-full pointer-events-none z-0", className)} 
    />
  );
};
