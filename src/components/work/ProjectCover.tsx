import Image from 'next/image'
import type { Project } from '@/content/projects'
import type { Locale } from '@/lib/i18n'
import { Symbol } from '@/components/brand/Logo'

/**
 * 16:10 project capture on a Cloud ground. Without a capture, a neutral
 * branded frame is shown (never a fake screenshot).
 */
export function ProjectCover({ project, locale, sizes, priority, className = '' }: {
  project: Project
  locale: Locale
  sizes: string
  priority?: boolean
  className?: string
}) {
  if (project.cover) {
    return (
      <Image
        src={project.cover.src}
        alt={project.cover.alt[locale]}
        width={project.cover.width}
        height={project.cover.height}
        sizes={sizes}
        priority={priority}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return (
    <div className={`relative flex h-full w-full items-center justify-center bg-cloud ${className}`} role="img" aria-label={project.client}>
      <div className="flex w-[64%] flex-col border border-line bg-white">
        <div className="flex h-6 items-center gap-1 border-b border-line px-2.5">
          <i className="block h-1.5 w-1.5 bg-line" /><i className="block h-1.5 w-1.5 bg-line" /><i className="block h-1.5 w-1.5 bg-line" />
        </div>
        <div className="flex aspect-[16/9] items-center justify-center">
          <Symbol className="w-[14%]" />
        </div>
      </div>
    </div>
  )
}
