import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { ExpertBadge } from './ExpertBadge'

type Expertise = 'diyetisyen' | 'ebe' | 'doktor'

export interface PostCardData {
  slug: string
  title: string
  excerpt?: string | null
  coverImage?: { url?: string | null; alt?: string | null } | null
  category?: { slug?: string; name?: string } | null
  author?: {
    name?: string
    expertise?: Expertise
    photo?: { url?: string | null } | null
  } | null
  publishedAt?: string | Date | null
}

export function PostCard({
  post,
  className,
}: {
  post: PostCardData
  className?: string
}) {
  const date = post.publishedAt
    ? format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: tr })
    : null

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border border-nene-mist bg-nene-cream transition hover:border-nene-rust/30 hover:shadow-sm',
        className,
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block no-underline">
        <div className="relative aspect-[16/10] w-full bg-nene-mist/60">
          {post.coverImage?.url ? (
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt ?? post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-3xl text-nene-ink/20">
              nenenesor
            </div>
          )}
          {post.category?.name ? (
            <span className="absolute left-3 top-3 rounded-full bg-nene-cream/95 px-2.5 py-1 text-xs font-medium text-nene-ink shadow-sm">
              {post.category.name}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="font-serif text-xl leading-snug text-nene-ink group-hover:text-nene-rust">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="line-clamp-3 text-sm text-nene-ink/70">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-auto flex items-center gap-3 pt-3">
            {post.author?.photo?.url ? (
              <Image
                src={post.author.photo.url}
                alt={post.author.name ?? 'Uzman'}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : post.author?.name ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nene-mist text-xs font-medium text-nene-ink/70">
                {post.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
            ) : null}
            <div className="flex flex-col text-xs text-nene-ink/70">
              <div className="flex items-center gap-2">
                <span className="font-medium text-nene-ink">
                  {post.author?.name}
                </span>
                {post.author?.expertise ? (
                  <ExpertBadge expertise={post.author.expertise} />
                ) : null}
              </div>
              {date ? <span className="text-nene-ink/50">{date}</span> : null}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
