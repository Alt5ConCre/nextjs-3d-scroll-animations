import type { ReactNode } from "react";

export type CinematicChapterProps = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  children?: ReactNode;
  align?: "start" | "end";
};

export function CinematicChapter({
  id,
  eyebrow,
  title,
  text,
  children,
  align = "end",
}: CinematicChapterProps) {
  return (
    <section
      id={id}
      className={`chapter content-chapter content-chapter--${align}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="chapter-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p className="lede">{text}</p>
        {children}
      </div>
    </section>
  );
}
