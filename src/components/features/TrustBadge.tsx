import { Star } from "lucide-react";
import Image from "next/image";

export const TrustBadge = () => {
    return (
        <a
            href="https://www.google.com/maps/search/?api=1&query=Zalew+Koz%C5%82owski&query_place_id=ChIJyca1WCEbPUcRLCImk6TmaBg"
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
