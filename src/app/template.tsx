"use client";
 
import { useEffect } from "react";
import { motion } from "framer-motion";
 
export default function Template({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Usuwanie klasy transition-lock po zakończeniu wczytywania nowej podstrony
        document.body.classList.remove("page-transitioning");
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}

