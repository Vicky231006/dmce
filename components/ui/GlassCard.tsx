import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    glow?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, glow = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all",
                    glow && "hover:border-cyan-glow/30 hover:shadow-[0_0_30px_-10px_rgba(0,217,255,0.15)]",
                    className
                )}
                {...props}
            >
                {children}
                {/* Subtle noise texture overlay could go here */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-50" />
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
