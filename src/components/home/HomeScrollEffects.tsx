"use client";

import { useEffect } from "react";

export default function HomeScrollEffects() {
    useEffect(() => {
        const container = document.getElementById("home-scroll-container");
        if (!container) return;

        const panels = Array.from(container.querySelectorAll<HTMLElement>("[data-home-panel]"));
        const orbOne = container.querySelector<HTMLElement>(".home-live-orb--one");
        const orbTwo = container.querySelector<HTMLElement>(".home-live-orb--two");
        const orbThree = container.querySelector<HTMLElement>(".home-live-orb--three");

        let ticking = false;

        const updateBackground = () => {
            const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 1);
            const progress = container.scrollTop / maxScroll;
            container.style.setProperty("--home-scroll-progress", progress.toFixed(4));

            orbOne?.style.setProperty("--orb-shift", `${-8 + progress * 18}vw`);
            orbTwo?.style.setProperty("--orb-shift", `${6 - progress * 16}vw`);
            orbThree?.style.setProperty("--orb-shift", `${-5 + progress * 12}vw`);

            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateBackground);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("is-visible", entry.isIntersecting && entry.intersectionRatio > 0.3);
                });
            },
            {
                root: container,
                threshold: [0.2, 0.35, 0.6],
            },
        );

        panels.forEach((panel) => observer.observe(panel));
        updateBackground();
        container.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            observer.disconnect();
            container.removeEventListener("scroll", onScroll);
            container.style.removeProperty("--home-scroll-progress");
            panels.forEach((panel) => panel.classList.remove("is-visible"));
        };
    }, []);

    return null;
}
