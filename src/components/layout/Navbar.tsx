import { NavbarClient } from "./NavbarClient";
import Image from "next/image";

export const Navbar = () => {
    const logo = (
        <div className="relative h-16 w-32 shrink-0">
            <Image
                src="/logo-brand.png"
                alt="Zalew Kozłowski Logo"
                fill
                priority
                className="object-contain"
                sizes="128px"
                fetchPriority="high"
            />
        </div>
    );

    return <NavbarClient logo={logo} />;
};
