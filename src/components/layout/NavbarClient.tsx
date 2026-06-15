"use client";
 
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackPhoneCall } from "@/lib/analytics";
import { WeatherWidget } from "@/components/features/WeatherWidget";
import { Magnetic } from "@/components/ui/magnetic";
import { WeatherData } from "@/app/actions/weather";
import { SPRING_TOKENS } from "@/lib/motion";

const NAV_ITEMS = [
    { labelKey: "about", href: "/o-lowisku" },
    { labelKey: "rules", href: "/regulamin" },
    { labelKey: "pricing", href: "/cennik" },
    { labelKey: "gallery", href: "/galeria" },
    { labelKey: "news", href: "/aktualnosci" },
    { labelKey: "contact", href: "/kontakt" },
];

interface NavbarClientProps {
    initialWeather: WeatherData;
    phone?: string;
}

export const NavbarClient = ({ initialWeather, phone = "601 389 365" }: NavbarClientProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("navbar");
    const tCommon = useTranslations("common");

    const toggleLocale = () => {
        const nextLocale = locale === "pl" ? "en" : "pl";
        router.replace(pathname, { locale: nextLocale });
    };

    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    const navRef = useRef<HTMLElement>(null);

    // Escape key and mobile menu focus trap
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }

            if (e.key === "Tab") {
                if (!navRef.current) return;
                
                const focusables = navRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex="0"]'
                );
                
                if (focusables.length === 0) return;

                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    useEffect(() => {
        setMounted(true);
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        if (nextTheme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
        setIsOpen(false);
    };

    // Warianty animacji dla menu mobilnego (staggered entrance/exit)
    const menuContainerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.06,
                delayChildren: 0.1,
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.04,
                staggerDirection: -1,
                when: "afterChildren",
            }
        }
    } as const;

    const menuItemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                type: "spring", 
                stiffness: 120, 
                damping: 14 
            } 
        },
        exit: { 
            opacity: 0, 
            y: -10, 
            transition: { 
                duration: 0.15 
            } 
        }
    } as const;


    return (
        <>
            <motion.nav
                ref={navRef}
                animate={{
                    width: (scrolled || isOpen) ? "92%" : "100%",
                    borderRadius: (scrolled || isOpen) ? (isOpen ? "32px" : "9999px") : "0px",
                }}
                transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 18,
                }}
                className={cn(
                    "fixed left-1/2 z-50 transition-colors duration-300 overflow-hidden",
                    (scrolled || isOpen)
                        ? "bg-white/75 dark:bg-[#071610]/75 backdrop-blur-xl border shadow-xl"
                        : "bg-linear-to-b from-black/80 via-black/40 to-transparent border-transparent"
                )}
                style={{
                    x: "-50%",
                    y: (scrolled || isOpen) ? 16 : 0,
                    borderColor: (scrolled || isOpen)
                        ? "rgba(var(--active-glow-color, 249, 115, 22), 0.15)"
                        : "transparent",
                    boxShadow: (scrolled || isOpen)
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px rgba(var(--active-glow-color, 249, 115, 22), 0.1)"
                        : "none"
                }}
            >
                <motion.div
                    animate={{
                        height: (scrolled || isOpen) ? 64 : 80
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 140,
                        damping: 18,
                    }}
                    className="mx-auto flex max-w-7xl items-center justify-between px-6 relative"
                >
                    {/* Left: Logo */}
                    <div className="flex-shrink-0 z-50">
                        {pathname === "/" ? (
                            <a 
                                href="#" 
                                onClick={handleLogoClick} 
                                className={cn(
                                    "flex items-center gap-2.5 group transition-all duration-300 cursor-pointer",
                                    scrolled || isOpen ? "text-pine-green-dark dark:text-white" : "text-white"
                                )}
                            >
                                {/* Logo Icon */}
                                <div className="relative h-16 w-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                    <Image
                                        src="/logo-icon-v6.png"
                                        alt="Zalew Kozłowski Logo"
                                        fill
                                        priority
                                        className={cn(
                                            "object-contain scale-[1.45] transition-all duration-300",
                                            (!scrolled || isOpen || theme === "dark") ? "brightness-110 saturate-[1.05] drop-shadow-[0_0_8px_rgba(249,115,22,0.2)]" : ""
                                        )}
                                        sizes="64px"
                                        fetchPriority="high"
                                    />
                                </div>
                                
                                {/* Logo Typography */}
                                <div className="hidden sm:flex flex-col text-current select-none">
                                    <span className="font-display font-bold text-[13px] leading-tight tracking-wide drop-shadow-sm">
                                        {tCommon("logo_text_1")}
                                    </span>
                                    <span className="font-display font-extrabold text-[16px] leading-tight tracking-tight text-sunset-orange dark:text-sunset-orange drop-shadow-sm -mt-0.5">
                                        {tCommon("logo_text_2")}
                                    </span>
                                </div>
                            </a>
                        ) : (
                            <TransitionLink 
                                href="/" 
                                onClick={handleLogoClick} 
                                className={cn(
                                    "flex items-center gap-2.5 group transition-all duration-300",
                                    scrolled || isOpen ? "text-pine-green-dark dark:text-white" : "text-white"
                                )}
                            >
                                {/* Logo Icon */}
                                <div className="relative h-16 w-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                    <Image
                                        src="/logo-icon-v6.png"
                                        alt="Zalew Kozłowski Logo"
                                        fill
                                        priority
                                        className={cn(
                                            "object-contain scale-[1.45] transition-all duration-300",
                                            (!scrolled || isOpen || theme === "dark") ? "brightness-110 saturate-[1.05] drop-shadow-[0_0_8px_rgba(249,115,22,0.2)]" : ""
                                        )}
                                        sizes="64px"
                                        fetchPriority="high"
                                    />
                                </div>
                                
                                {/* Logo Typography */}
                                <div className="hidden sm:flex flex-col text-current select-none">
                                    <span className="font-display font-bold text-[13px] leading-tight tracking-wide drop-shadow-sm">
                                        {tCommon("logo_text_1")}
                                    </span>
                                    <span className="font-display font-extrabold text-[16px] leading-tight tracking-tight text-sunset-orange dark:text-sunset-orange drop-shadow-sm -mt-0.5">
                                        {tCommon("logo_text_2")}
                                    </span>
                                </div>
                            </TransitionLink>
                        )}
                    </div>

                    {/* Center: Desktop Menu */}
                    <div className="hidden xl:flex items-center justify-center flex-1 mx-6 gap-1.5">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            
                            // Dynamiczne klasy kolorystyczne w zależności od scrolla i motywu
                            const linkTextClass = isActive
                                ? "" 
                                : scrolled
                                    ? "text-pine-green dark:text-white hover:text-pine-green/80 dark:hover:text-white/90"
                                    : "text-white hover:text-white/90";

                            return (
                                <div
                                    key={item.href}
                                    onMouseEnter={() => setHoveredPath(item.href)}
                                    onMouseLeave={() => setHoveredPath(null)}
                                    className="relative"
                                >
                                    <TransitionLink
                                        href={item.href}
                                        className={cn(
                                            "relative px-4 py-2 text-sm font-bold transition-all rounded-full group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sunset-orange block",
                                            isActive ? "" : linkTextClass
                                        )}
                                        style={isActive ? { color: "rgb(var(--active-glow-color, 249, 115, 22))" } : undefined}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <span className="relative z-10 drop-shadow-sm whitespace-nowrap">{t(item.labelKey)}</span>

                                        {hoveredPath === item.href && (
                                            <motion.div
                                                layoutId="navbar-hover"
                                                className={cn(
                                                    "absolute inset-0 z-0 rounded-full backdrop-blur-md border",
                                                    scrolled
                                                        ? "bg-pine-green/10 dark:bg-white/15 border-pine-green/20 dark:border-white/20"
                                                        : "bg-white/12 border-white/15"
                                                )}
                                                transition={{
                                                    type: "spring",
                                                    ...SPRING_TOKENS.snappy
                                                }}
                                            />
                                        )}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-active"
                                                className={cn(
                                                    "absolute inset-0 z-0 rounded-full border navbar-active-pill-indicator",
                                                    scrolled
                                                        ? "bg-pine-green/5 dark:bg-white/5"
                                                        : "bg-white/5"
                                                )}
                                                style={{
                                                    viewTransitionName: "active-nav-pill",
                                                    borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.3)",
                                                    boxShadow: "0 0 20px rgba(var(--active-glow-color, 249, 115, 22), 0.25)"
                                                } as React.CSSProperties}
                                                transition={{
                                                    type: "spring",
                                                    ...SPRING_TOKENS.snappy
                                                }}
                                            >
                                                <div 
                                                    className="absolute inset-x-0 -bottom-px h-px opacity-50" 
                                                    style={{
                                                        background: "linear-gradient(to right, transparent, rgb(var(--active-glow-color, 249, 115, 22)), transparent)"
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </TransitionLink>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Tools & Mobile Controls */}
                    <div className="flex-shrink-0 flex justify-end items-center gap-3 z-50">
                        {/* Desktop Tools */}
                        <div className="hidden xl:flex items-center gap-3">
                            <WeatherWidget 
                                initialWeather={initialWeather} 
                                className={cn(
                                    "transition-all duration-300",
                                    scrolled 
                                        ? "bg-pine-green/5 dark:bg-white/10 text-pine-green-dark dark:text-white/90 border-pine-green/10 dark:border-white/10"
                                        : "bg-white/10 text-white/90 border-white/10"
                                )} 
                            />

                            {/* Theme Toggle (Desktop) */}
                            <button
                                onClick={toggleTheme}
                                className={cn(
                                    "p-2 transition-all duration-300 flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 hover:scale-110 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sunset-orange rounded-full",
                                    scrolled
                                        ? "text-pine-green-dark dark:text-white"
                                        : "text-white"
                                )}
                                aria-label={t("theme_toggle")}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {!mounted ? (
                                        <span className="w-5 h-5 block" key="placeholder" />
                                    ) : (
                                        <motion.div
                                            key={theme}
                                            initial={{ y: -10, opacity: 0, rotate: -90 }}
                                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                                            exit={{ y: 10, opacity: 0, rotate: 90 }}
                                            transition={{ duration: 0.15 }}
                                            className="flex items-center justify-center"
                                        >
                                            {theme === "dark" ? (
                                                <Sun className="h-5 w-5 text-amber-400" />
                                            ) : (
                                                <Moon className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* Language Toggle (Desktop) */}
                            <button
                                onClick={toggleLocale}
                                className={cn(
                                    "px-2.5 py-1 text-xs font-extrabold tracking-wider transition-all duration-300 flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 hover:scale-105 border rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sunset-orange",
                                    scrolled
                                        ? "text-pine-green-dark dark:text-stone-300 border-pine-green/10 dark:border-white/10 hover:bg-pine-green/5 dark:hover:bg-white/5"
                                        : "text-white border-white/20 hover:bg-white/10"
                                )}
                                aria-label={locale === "pl" ? "Switch to English" : "Przełącz na język polski"}
                            >
                                {locale === "pl" ? "EN" : "PL"}
                            </button>

                            <Magnetic>
                                <a
                                    href={`tel:${phone.replace(/\s+/g, "")}`}
                                    onClick={() => trackPhoneCall("navbar_cta", phone)}
                                    className={cn(
                                        "relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sunset-orange hover:scale-105 active:scale-95 flex items-center gap-2 group btn-hero-shine border z-10",
                                        scrolled
                                            ? "text-pine-green-dark dark:text-white border-[rgba(var(--active-glow-color,249,115,22),0.3)] hover:border-transparent hover:text-white hover:shadow-[0_10px_20px_-5px_rgba(var(--active-glow-color,249,115,22),0.45)]"
                                            : "text-white border-white/25 hover:border-transparent hover:shadow-[0_10px_20px_-5px_rgba(var(--active-glow-color,249,115,22),0.45)]"
                                    )}
                                    style={{
                                        backgroundColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.08)",
                                    }}
                                >
                                    {/* Hover Gradient Overlay */}
                                    <div 
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                                        style={{
                                            backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                            transitionDuration: "var(--duration-normal)",
                                            transitionTimingFunction: "var(--ease-premium-reveal)"
                                        }}
                                    />
                                    <Phone className="h-4 w-4 transition-transform group-hover:animate-shake shrink-0 relative z-10" />
                                    <span className="relative z-10">{tCommon("call")}</span>
                                </a>
                            </Magnetic>
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex xl:hidden items-center gap-3">

                            <button
                                onClick={toggleTheme}
                                className={cn(
                                    "rounded-full p-2 transition-all duration-300 flex items-center justify-center cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sunset-orange",
                                    scrolled || isOpen
                                        ? "text-pine-green-dark dark:text-white bg-pine-green/5 dark:bg-white/10 hover:bg-pine-green/10 dark:hover:bg-white/20 border border-pine-green/10 dark:border-white/10"
                                        : "text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10"
                                )}
                                aria-label={t("theme_toggle")}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {!mounted ? (
                                        <span className="w-5 h-5 block" key="placeholder" />
                                    ) : (
                                        <motion.div
                                            key={theme}
                                            initial={{ y: -10, opacity: 0, rotate: -90 }}
                                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                                            exit={{ y: 10, opacity: 0, rotate: 90 }}
                                            transition={{ duration: 0.15 }}
                                            className="flex items-center justify-center"
                                        >
                                            {theme === "dark" ? (
                                                <Sun className="h-5 w-5 text-amber-400" />
                                            ) : (
                                                <Moon className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* Language Toggle (Mobile) */}
                            <button
                                onClick={toggleLocale}
                                className={cn(
                                    "px-2.5 py-1 text-xs font-extrabold tracking-wider transition-all duration-300 flex items-center justify-center cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sunset-orange rounded-full",
                                    scrolled || isOpen
                                        ? "text-pine-green-dark dark:text-stone-300 bg-pine-green/5 dark:bg-white/10 border border-pine-green/10 dark:border-white/10 hover:bg-pine-green/10 dark:hover:bg-white/20"
                                        : "text-white border border-white/20 hover:bg-white/10"
                                )}
                                aria-label={locale === "pl" ? "Switch to English" : "Przełącz na język polski"}
                            >
                                {locale === "pl" ? "EN" : "PL"}
                            </button>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={cn(
                                    "rounded-full p-2 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sunset-orange",
                                    scrolled || isOpen
                                        ? "text-pine-green-dark dark:text-white hover:bg-pine-green/5 dark:hover:bg-white/10"
                                        : "text-white hover:bg-white/10"
                                )}
                                aria-label={t("menu_toggle")}
                                aria-expanded={isOpen}
                                aria-controls="mobile-menu"
                                aria-haspopup="true"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Mobile Menu Content (Expanding inside the Pod) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="xl:hidden border-t border-pine-green/10 dark:border-white/10 overflow-hidden"
                        >
                            <motion.div 
                                className="flex flex-col items-center gap-6 text-center w-full px-6 py-8"
                                variants={menuContainerVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                            >
                                {NAV_ITEMS.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div
                                            key={item.href}
                                            variants={menuItemVariants}
                                        >
                                            <TransitionLink
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "text-2xl font-bold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sunset-orange rounded-lg px-4 py-1 block",
                                                    isActive 
                                                        ? "" 
                                                        : "text-pine-green dark:text-white hover:text-pine-green/80 dark:hover:text-white/90"
                                                )}
                                                style={isActive ? { color: "rgb(var(--active-glow-color, 249, 115, 22))" } : undefined}
                                                aria-current={isActive ? "page" : undefined}
                                            >
                                                {t(item.labelKey)}
                                            </TransitionLink>
                                        </motion.div>
                                    );
                                })}

                                {/* Mobile Weather Widget */}
                                <motion.div
                                    variants={menuItemVariants}
                                    className="w-full max-w-xs flex justify-center mt-2"
                                >
                                    <WeatherWidget 
                                        initialWeather={initialWeather} 
                                        className="flex w-full bg-pine-green/5 dark:bg-white/10 text-pine-green-dark dark:text-white/90 border-pine-green/10 dark:border-white/20" 
                                    />
                                </motion.div>

                                <motion.div
                                    variants={menuItemVariants}
                                    className="mt-2"
                                >
                                    <a
                                        href={`tel:${phone.replace(/\s+/g, "")}`}
                                        onClick={() => trackPhoneCall("navbar_cta", phone)}
                                        className="relative overflow-hidden rounded-full px-8 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sunset-orange flex items-center gap-3 justify-center group btn-hero-shine"
                                        style={{ 
                                            backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                            boxShadow: "0 10px 20px -5px rgba(var(--active-glow-color, 249, 115, 22), 0.45)"
                                        }}
                                    >
                                        {/* Live indicator dot */}
                                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                                        </span>
                                        <Phone className="h-5 w-5 transition-transform group-hover:animate-shake shrink-0" />
                                        <span className="relative z-10">{tCommon("call")}</span>
                                    </a>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};


