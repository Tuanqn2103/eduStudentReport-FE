/* eslint-disable react/no-array-index-key */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const teacherImages = [
    "/img/img3.png",
    "/img/img5.png",
    "/img/img10.png",
];

type Layout = "stack" | "grid" | "carousel";

interface TeacherImagesProps {
    size?: number;
    layout?: Layout;
    className?: string;
    intervalMs?: number;
}

export default function TeacherImages({
    size = 64,
    layout = "stack",
    className = "",
    intervalMs = 2500,
}: TeacherImagesProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (layout !== "carousel") return;
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % teacherImages.length);
        }, intervalMs);
        return () => clearInterval(id);
    }, [layout, intervalMs]);

    const current = useMemo(() => teacherImages[index], [index]);

    if (layout === "grid") {
        return (
            <div className={cn("grid grid-cols-4 gap-2", className)}>
                {teacherImages.map((src) => (
                    <Image
                        key={src}
                        src={src}
                        alt="Giáo viên"
                        width={size}
                        height={size}
                        className="h-full w-full rounded-xl object-cover shadow-md"
                        quality={90}
                    />
                ))}
            </div>
        );
    }

    if (layout === "carousel") {
        return (
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-white/70 bg-white/40 p-2 shadow-xl backdrop-blur", "aspect-[4/3]",
                    className
                )}
                style={{ aspectRatio: "16/10", width: size * 3 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 30, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -30, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                        className="h-full w-full"
                    >
                        <Image
                            src={current}
                            alt="Giáo viên"
                            fill
                            className="rounded-xl object-top"
                            quality={95}
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                    {teacherImages.map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                "h-1.5 w-6 rounded-full bg-white/70 transition-all",
                                i === index ? "bg-white shadow" : "opacity-50"
                            )}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center justify-center", className)}>
                <div                    
                    style={{ width: size, height: size }}
                >
                    <Image
                        src={"/img/img5.png"}
                        alt="Giáo viên"
                        width={size}
                        height={size}
                        className="h-full w-full object-cover"
                        quality={90}
                    />
                </div>
        </div>
    );
}

