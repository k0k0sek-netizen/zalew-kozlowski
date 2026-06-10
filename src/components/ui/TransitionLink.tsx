"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export const TransitionLink = ({ children, href, className, ...props }: TransitionLinkProps) => {
  const router = useRouter();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Run custom onClick handler if passed in props
    if (props.onClick) {
      props.onClick(e);
    }

    if (e.defaultPrevented) {
      return;
    }

    e.preventDefault();

    // Zapobieganie wielokrotnym kliknięciom w trakcie trwania przejścia
    if (document.body.classList.contains("page-transitioning")) {
      return;
    }

    // Dodanie klasy wygaszającej zawartość główną (main)
    document.body.classList.add("page-transitioning");

    const navigate = () => {
      router.push(href);
    };

    // View Transitions API (Chrome / Edge / Opera / Safari 18+)
    if ((document as any).startViewTransition) {
      setTimeout(() => {
        const transition = (document as any).startViewTransition(() => {
          return new Promise<void>((resolve) => {
            navigate();
            
            // Pobieramy czystą ścieżkę z href (bez query i hasha) i normalizujemy ukośniki na końcu
            const normalize = (p: string) => p.replace(/\/$/, "");
            const targetPathname = normalize(href.split("?")[0].split("#")[0]);

            let isResolved = false;

            // Bezpiecznik (600ms) - zapobiega zamrożeniu ekranu w trybie dev (kompilacja Turbopack)
            const safetyTimeout = setTimeout(() => {
              isResolved = true;
              resolve();
            }, 600);

            // Odpytywanie w celu wykrycia faktycznego przesunięcia wskaźnika w menu
            const checkPath = () => {
              if (isResolved) return;

              const targetLink = document.querySelector(`a[href="${targetPathname}"], a[href="${targetPathname}/"]`);
              const hasUrlChanged = normalize(window.location.pathname) === targetPathname;
              
              // Podstrony posiadające aktywny wskaźnik w menu głównym
              const isMenuLink = ["/o-lowisku", "/regulamin", "/cennik", "/galeria", "/aktualnosci", "/kontakt"].includes(targetPathname);

              if (targetLink && isMenuLink) {
                const activePill = document.querySelector(".navbar-active-pill-indicator");
                if (activePill && targetLink.contains(activePill)) {
                  isResolved = true;
                  clearTimeout(safetyTimeout);
                  requestAnimationFrame(() => {
                    resolve();
                  });
                  return;
                }
              } else if (hasUrlChanged) {
                isResolved = true;
                clearTimeout(safetyTimeout);
                requestAnimationFrame(() => {
                  resolve();
                });
                return;
              }

              setTimeout(checkPath, 15);
            };
            
            checkPath();
          });
        });

        // Zapobiegamy nieobsłużonym błędom obietnic w konsoli, gdy przeglądarka anuluje animację (np. szybki dwuklik)
        if (transition) {
          transition.ready?.catch(() => {});
          transition.finished?.catch(() => {});
          transition.updateCallbackDone?.catch(() => {});
        }
      }, 180); // Wstrzymanie o 180ms na płynne wygaszenie starej strony w CSS
    } else {
      // Fallback dla Safari < 18 i Firefox
      setTimeout(() => {
        navigate();
      }, 180);
    }
  };

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
      onClick={handleTransition} 
      onMouseMove={handleMouseMove} 
    >
      {children}
    </Link>
  );
};

