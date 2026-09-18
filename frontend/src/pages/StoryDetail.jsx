import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Facebook, Linkedin, Twitter, Link2, MessageCircle } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'
import { getStoryBySlug, getStories } from '../lib/api'
import { formatDate, readingTime } from '../lib/format'

export default function StoryDetail() {
  const { slug } = useParams()
  const [story, setStory] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setStory(null)
    setNotFound(false)
    getStoryBySlug(slug)
      .then((data) => {
        setStory(data)
        getStories({ category: data.category }).then((res) =>
          setRelated(res.items.filter((s) => s.id !== data.id).slice(0, 3))
        )
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) return <Navigate to="/404" replace />
  if (!story) return <div className="min-h-[60vh]" />

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  function copyLink() {
    navigator.clipboard?.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Seo
        title={story.title}
        description={story.excerpt}
        path={`/stories/${story.slug}`}
        image={story.coverImage}
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: story.title,
          image: story.coverImage,
          author: { '@type': 'Person', name: story.author },
          datePublished: story.publishDate,
        }}
      />

      <article className="pt-32 pb-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-medium text-marigold-600">{story.category}</p>
            <h1 className="mt-3 font-display text-display-md font-medium text-pine-700 sm:text-display-lg">
              {story.title}
            </h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-moss">
              <span>{story.author}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(story.publishDate)}</span>
              <span aria-hidden="true">·</span>
              <span>{readingTime(story.content)} min read</span>
            </div>
          </div>

          <img
            src={story.coverImage}
            alt={story.title}
            className="mx-auto mt-10 aspect-[16/9] w-full max-w-4xl rounded-sm object-cover"
          />

          <div className="mx-auto mt-10 max-w-2xl">
            <p className="text-lg leading-relaxed text-ink">{story.content}</p>

            <div className="mt-12 flex items-center gap-3 border-y border-pine-100 py-5">
              <span className="text-sm font-medium text-pine-700">Share this story</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(story.title + ' ' + shareUrl)}`}
                target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"
                className="text-moss hover:text-marigold-600"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"
                className="text-moss hover:text-marigold-600"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"
                className="text-moss hover:text-marigold-600"
              >
                <Facebook size={18} />
              </a>
              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(story.title)}`}
                target="_blank" rel="noopener noreferrer" aria-label="Share on X"
                className="text-moss hover:text-marigold-600"
              >
                <Twitter size={18} />
              </a>
              <button onClick={copyLink} aria-label="Copy link" className="text-moss hover:text-marigold-600">
                <Link2 size={18} />
              </button>
              {copied && <span className="text-xs text-marigold-600">Copied</span>}
            </div>

            {story.relatedProject && (
              <Link
                to={`/projects/${story.relatedProject.slug}`}
                className="mt-10 block rounded-sm bg-pine-50 p-6 text-pine-700 hover:bg-pine-100"
              >
                Read more about the project behind this story →
              </Link>
            )}
          </div>

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-4xl border-t border-pine-100 pt-12">
              <h2 className="font-display text-2xl text-pine-700">More {story.category.toLowerCase()}</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {related.map((s) => (
                  <Link key={s.id} to={`/stories/${s.slug}`} className="group">
                    <img src={s.coverImage} alt="" className="h-32 w-full rounded-sm object-cover" loading="lazy" />
                    <p className="mt-2 text-sm font-medium text-pine-700 group-hover:text-marigold-600 leading-snug">
                      {s.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </article>
    </>
  )
}
