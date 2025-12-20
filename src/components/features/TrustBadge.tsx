import { Star } from "lucide-react";
import Image from "next/image";

export const TrustBadge = () => {
    return (
        <a
            href="https://www.google.pl/maps/place/Zalew+Koz%C5%82owski/@50.0944237,21.4462375,17z/data=!3m1!4b1!4m6!3m5!1s0x473d0b2158b5c6c9:0x1868e6a4962b222c!8m2!3d50.0944237!4d21.4462375"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors group"
        >
            <div className="flex items-center gap-0.5 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white leading-none">5.0 / 5.0</span>
                <span className="text-[10px] text-white/70 group-hover:text-white/90">
                    Zobacz opinie na Google
                </span>
            </div>
            {/* Optional: Google Logo Icon if you want */}
            {/* <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-500">G</span>
            </div> */}
        </a>
    );
};
