import { useCountUp } from '../../hooks/useCountUp'
import { formatNumber } from '../../lib/format'

export default function Counter({ value, suffix = '', label, duration = 1600 }) {
  const { ref, value: current } = useCountUp(value, { duration })
  return (
    <div ref={ref}>
    <p className="font-display text-4xl sm:text-5xl lg:text-[38px] xl:text-[42px] 2xl:text-5xl leading-none text-pine-900">
        {formatNumber(current)}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-moss">{label}</p>
    </div>
  )
}
