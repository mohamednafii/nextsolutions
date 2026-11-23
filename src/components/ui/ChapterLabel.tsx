/**
 * Chapter label used by every homepage section: a hairline, the chapter
 * number and its name ("04 / Nos réalisations"). Same mark as the Vision
 * label, so the page reads as one numbered story. Blue on light, Sky on Ink.
 */
export function ChapterLabel({ n, label, className = '' }: { n: string; label: string; className?: string }) {
  return (
    <p className={`chapter-label t-overline ${className}`}>
      {n} / {label}
    </p>
  )
}
