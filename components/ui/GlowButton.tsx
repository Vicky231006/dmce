import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "relative inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-glow disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
    {
        variants: {
            variant: {
                default:
                    "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/50 hover:bg-cyan-glow/20 hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]",
                secondary:
                    "bg-white/5 text-star-white border border-white/10 hover:bg-white/10 hover:border-white/20",
                ghost: "hover:bg-white/5 text-star-white",
                danger:
                    "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-md px-3",
                lg: "h-12 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const GlowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                <span className="relative z-10 flex items-center gap-2">{children}</span>
                {variant === 'default' && (
                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-cyan-glow/0 via-cyan-glow/10 to-cyan-glow/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                )}
            </button>
        );
    }
);
GlowButton.displayName = "GlowButton";

export { GlowButton, buttonVariants };
