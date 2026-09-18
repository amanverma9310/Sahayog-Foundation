import Container from '../ui/Container'
import Counter from '../ui/Counter'
import SectionHeading from '../ui/SectionHeading'

export default function ImpactCounters({ stats }) {
  return (
    <section className="border-y border-pine-100 bg-paper-dim py-20">
      <Container>
        <SectionHeading
          eyebrow="The work, in numbers"
          title="What direct, repeat-visit relief adds up to"
          description="Every figure below is pulled from programme records, not estimated. Full methodology is in our quarterly report."
        />
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <Counter key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </Container>
    </section>
  )
}
