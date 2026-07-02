'use client'

import { useEffect, useState } from 'react'

import { Bookmark, Heart, Link2, MessageCircle, Share2 } from 'lucide-react'

import { cn } from '@/lib/utils'

// Frontend-only for now: like/save state lives in localStorage per slug.
// When the backend lands, swap the toggle handlers for API calls.
const LIKED_KEY = 'nene-liked-posts'
const SAVED_KEY = 'nene-saved-posts'
const SYNC_EVENT = 'nene:post-actions-sync'

function readSlugs(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function toggleSlug(key: string, slug: string): boolean {
  const slugs = readSlugs(key)
  const active = slugs.includes(slug)
  const next = active ? slugs.filter((s) => s !== slug) : [...slugs, slug]
  try {
    window.localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // storage unavailable (private mode) — state stays in-memory for the session
  }
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { slug } }))
  return !active
}

interface PostActionsProps {
  slug: string
  title: string
  /** id of the comments section the comment button scrolls to */
  commentsTargetId?: string
  className?: string
}

export function PostActions({
  slug,
  title,
  commentsTargetId = 'yorumlar',
  className,
}: PostActionsProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  // Read persisted state on mount and re-sync when a sibling instance toggles.
  useEffect(() => {
    const sync = () => {
      setLiked(readSlugs(LIKED_KEY).includes(slug))
      setSaved(readSlugs(SAVED_KEY).includes(slug))
    }
    sync()
    window.addEventListener(SYNC_EVENT, sync)
    return () => window.removeEventListener(SYNC_EVENT, sync)
  }, [slug])

  function handleLike() {
    setLiked(toggleSlug(LIKED_KEY, slug))
  }

  function handleSave() {
    setSaved(toggleSlug(SAVED_KEY, slug))
  }

  function handleComment() {
    document
      .getElementById(commentsTargetId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // user dismissed the share sheet — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — nothing sensible to do
    }
  }

  const baseButton =
    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors'
  const idle =
    'border-nene-ink/15 bg-transparent text-nene-ink/70 hover:border-nene-rust/40 hover:text-nene-rust'

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 border-y border-nene-mist py-3',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleLike}
        aria-pressed={liked}
        className={cn(
          baseButton,
          liked
            ? 'border-nene-rust/40 bg-nene-rust/10 text-nene-rust'
            : idle,
        )}
      >
        <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
        {liked ? 'Beğendin' : 'Beğen'}
      </button>

      <button type="button" onClick={handleComment} className={cn(baseButton, idle)}>
        <MessageCircle className="h-4 w-4" />
        Yorum
      </button>

      <button
        type="button"
        onClick={handleSave}
        aria-pressed={saved}
        className={cn(
          baseButton,
          saved
            ? 'border-nene-gold/50 bg-nene-gold/10 text-nene-ink'
            : idle,
        )}
      >
        <Bookmark className={cn('h-4 w-4', saved && 'fill-nene-gold text-nene-gold')} />
        {saved ? 'Kaydedildi' : 'Kaydet'}
      </button>

      <button type="button" onClick={handleShare} className={cn(baseButton, idle)}>
        {copied ? <Link2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? 'Bağlantı kopyalandı' : 'Paylaş'}
      </button>
    </div>
  )
}
