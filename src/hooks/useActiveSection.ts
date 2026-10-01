import { useEffect, useState } from "react";

/** Tracks which page section is currently in view (for nav highlight + avatar state). */
export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    const elements: Element[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }
    return () => {
      for (const el of elements) observer.unobserve(el);
      observer.disconnect();
    };
  }, [sectionIds.join(",")]);

  return active;
}
