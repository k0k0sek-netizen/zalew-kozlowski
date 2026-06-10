// src/lib/motion.ts
export const SPRING_TOKENS = {
    // Dla elementów śledzących kursor (np. Magnetic, custom cursor)
    fluid: { damping: 15, stiffness: 150, mass: 0.1 },
    // Dla wyskakujących okienek (np. CookieConsent, modale)
    bouncy: { damping: 15, stiffness: 200, mass: 0.4 },
    // Dla sliderów, nawigacji i zmian układu (layoutId)
    snappy: { damping: 25, stiffness: 300, mass: 0.5 }
};
