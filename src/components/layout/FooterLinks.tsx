"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { trackPhoneCall, trackEmailClick } from "@/lib/analytics";

interface TrackablePhoneLinkProps {
    phone: string;
    className?: string;
    children: React.ReactNode;
}

export const TrackablePhoneLink = ({ phone, className, children }: TrackablePhoneLinkProps) => (
    <a
        href={`tel:${phone.replace(/\s+/g, "")}`}
        onClick={() => trackPhoneCall("footer", phone)}
        className={className}
    >
        {children}
    </a>
);

interface TrackableEmailLinkProps {
    email: string;
    className?: string;
    children: React.ReactNode;
}

export const TrackableEmailLink = ({ email, className, children }: TrackableEmailLinkProps) => (
    <a
        href={`mailto:${email}`}
        onClick={() => trackEmailClick("footer", email)}
        className={className}
    >
        {children}
    </a>
);

interface FooterLogoLinkProps {
    className?: string;
    children: React.ReactNode;
}

export const FooterLogoLink = ({ className, children }: FooterLogoLinkProps) => {
    const pathname = usePathname();

    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    if (pathname === "/") {
        return (
            <a 
                href="#" 
                onClick={handleLogoClick} 
                className={className}
            >
                {children}
            </a>
        );
    }

    return (
        <TransitionLink 
            href="/" 
            onClick={handleLogoClick} 
            className={className}
        >
            {children}
        </TransitionLink>
    );
};
