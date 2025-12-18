import { ComponentProps } from "react";

interface HeroVideoProps {
    videoSrc?: string;
    mobileVideoSrc?: string;
    posterSrc?: string;
}

export const HeroVideo = ({ videoSrc, mobileVideoSrc, posterSrc }: HeroVideoProps) => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-pine-green-dark">
            {/* LCP Optimization: High Priority Poster Image */}
            {posterSrc && (
                <img
                    src={posterSrc}
                    alt="Zalew Kozłowski"
                    className="absolute inset-0 h-full w-full object-cover -z-20"
                    fetchPriority="high"
                />
            )}

            {/* Overlay gradient for text readability and atmosphere */}
            <div
                className="absolute inset-0 z-10 bg-linear-to-b from-pine-green-dark/40 via-transparent to-pine-green-dark/90 transition-opacity duration-1000"
            />

            {!videoSrc && posterSrc && (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-2000 ease-out animate-zoom-out"
                    style={{ backgroundImage: `url('${posterSrc}')` }}
                />
            )}

            {videoSrc && (
                <video
                    className="absolute inset-0 h-full w-full object-cover animate-zoom-out"
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                >
                    {mobileVideoSrc && (
                        <source src={mobileVideoSrc} type="video/mp4" media="(max-width: 768px)" />
                    )}
                    <source src={videoSrc} type="video/mp4" />
                </video>
            )}
        </div>
    );
};
