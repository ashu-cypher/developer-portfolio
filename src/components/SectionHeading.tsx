import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Optional supporting line under the title */
  subtitle?: string;
  align?: "left" | "center";
}

/** Consistent section header: eyebrow label + big display title. */
export function SectionHeading({ eyebrow, title, subtitle, align = "left" }: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <Reveal className={`flex flex-col gap-3 ${alignCls}`}>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="max-w-2xl text-base leading-relaxed text-mist">{subtitle}</p>}
    </Reveal>
  );
}
