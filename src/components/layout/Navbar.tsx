"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { WeatherWidget } from "@/components/features/WeatherWidget";

const NAV_ITEMS = [
    { label: "O Łowisku", href: "/o-lowisku" },
    { label: "Regulamin", href: "/regulamin" },
    { label: "Cennik", href: "/cennik" },
    { label: "Galeria", href: "/galeria" },
    { label: "Aktualności", href: "/aktualnosci" },
    { label: "Kontakt", href: "/kontakt" },
];

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

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

    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        setIsOpen(false);
    };

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-300",
                    scrolled || isOpen
                        ? "bg-pine-green-dark/80 backdrop-blur-md border-b border-white/10"
                        : "bg-transparent"
                )}
            >
                <div
                    className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 transition-all duration-300"
                >
                    <Link href="/" onClick={handleLogoClick} className="z-50 flex items-center gap-2 group">
                        <div
                            className="relative h-20 w-auto aspect-video transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-2 group-hover:drop-shadow-lg"
                        >
                            <Image
                                src="/logo-brand.png"
                                alt="Zalew Kozłowski Logo"
                                fill
                                className="object-contain" // Ensures logo isn't stretched
                                sizes="(max-width: 768px) 100vw, 200px"
                            />
                        </div>
                    </Link>



                    {/* Desktop Menu */}
                    <div className="hidden items-center gap-8 md:flex">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-neutral-300 transition-colors hover:text-sunset-orange"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <WeatherWidget className="hidden lg:flex" />

                        <a
                            href="tel:601389365"
                            className="rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sunset-orange hover:shadow-lg hover:shadow-orange-500/20"
                        >
                            Zadzwoń
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="z-50 rounded-full p-2 text-white transition-colors hover:bg-white/10 md:hidden"
                        aria-label="Menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-pine-green-dark/95 backdrop-blur-xl md:hidden"
                    >
                        <div className="flex flex-col items-center gap-8 text-center">
                            {NAV_ITEMS.map((item, idx) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-3xl font-bold text-white transition-colors hover:text-sunset-orange"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Weather Widget */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-full px-6 flex justify-center"
                            >
                                <WeatherWidget className="flex w-full max-w-xs bg-white/10 backdrop-blur-none border-white/20" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4"
                            >
                                <a
                                    href="tel:601389365"
                                    className="rounded-xl bg-sunset-orange px-8 py-3 text-lg font-bold text-white shadow-lg shadow-orange-500/20"
                                >
                                    Zadzwoń
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
