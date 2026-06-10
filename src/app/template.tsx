/**
 * Template — re-mounts on EVERY page navigation.
 *
 * Uses pure CSS animation instead of framer-motion to avoid
 * loading a JS library on every route change. The CSS animation
 * is GPU-composited (opacity + transform) and costs zero main-thread time.
 */
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-page-enter">
            {children}
        </div>
    );
}
