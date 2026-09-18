import { useEffect, useState } from 'react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import Accordion from '../components/ui/Accordion'
import { getFaqs } from '../lib/api'

const faqCategories = ['Donations', '80G', 'Projects', 'Volunteering', 'Internships', 'CSR', 'Payments', 'Refunds']

export default function FAQ() {
  const [faqs, setFaqs] = useState(null)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    getFaqs({ category: category === 'All' ? undefined : category }).then(setFaqs)
  }, [category])

  return (
    <>
      <Seo title="FAQ" description="Answers to common questions about donating, 80G receipts, volunteering, CSR partnerships and more." path="/faq" />
      <PageHero eyebrow="Help" title="Frequently asked questions" />

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-wrap gap-2">
              {['All', ...faqCategories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    category === cat ? 'bg-pine-700 text-white' : 'bg-paper-dim text-moss hover:bg-pine-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-10">
              {faqs && faqs.length > 0 && <Accordion items={faqs} />}
              {faqs && faqs.length === 0 && (
                <p className="py-10 text-center text-moss">No questions in this category yet.</p>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
