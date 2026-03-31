"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export default function MotionReveal({
    children,
    delay = 0,
    direction = "up",
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    className?: string;
}) {
    // Elegant spring physics for the scroll reveal
    const variants: Variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
            scale: 0.98,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                damping: 25,
                stiffness: 100,
                delay: delay,
            },
        },
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }} // Triggers when element is slightly into the viewport
            className={className}
        >
            {children}
        </motion.div>
    );
}
