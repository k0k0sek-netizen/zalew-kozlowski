"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { SPRING_TOKENS } from "@/lib/motion";

interface MagneticProps {
    children: React.ReactNode;
    strength?: number; // 0 to 1, how strong the pull is
}

export const Magnetic = ({ children, strength = 0.2 }: MagneticProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const position = { x: useMotionValue(0), y: useMotionValue(0) };

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const rect = ref.current?.getBoundingClientRect();

        if (rect) {
            const middleX = clientX - (rect.left + rect.width / 2);
            const middleY = clientY - (rect.top + rect.height / 2);
            position.x.set(middleX * strength);
            position.y.set(middleY * strength);
        }
    };

    const reset = () => {
        position.x.set(0);
        position.y.set(0);
    };

    const { x, y } = position;

    // Physics configuration for that "fluid" feel
    const springX = useSpring(x, SPRING_TOKENS.fluid);
    const springY = useSpring(y, SPRING_TOKENS.fluid);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
            className="relative"
        >
            {children}
        </motion.div>
    );
};
