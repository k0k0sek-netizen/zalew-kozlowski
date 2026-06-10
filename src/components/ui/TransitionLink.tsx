"use client";
import Link from "next/link";
import React from "react";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  href: string;
}

/**
 * TransitionLink — cienki wrapper na Next.js Link.
 * 
 * Zachowuje pełne prefetching Next.js (nawigacja instant przy hover),
 * animację wejścia z template.tsx (framer-motion) i efekt glow na btn-ai-glow.
 * 
 * Celowo NIE używamy e.preventDefault() ani setTimeout — każde sztuczne
 * opóźnienie sprawia że strona "czeka" zamiast nawigować natychmiastowo.
 */
export const TransitionLink = ({ children, href, className, ...props }: TransitionLinkProps) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.classList.contains("btn-ai-glow")) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <Link
      href={href}
      className={className}
      {...props}
      onMouseMove={handleMouseMove}
    >
      {children}
    </Link>
  );
};
