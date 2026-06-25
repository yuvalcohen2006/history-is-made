import { useMemo, useState } from 'react'
import { Reorder } from 'framer-motion'
import { GripVertical } from 'lucide-react'
import type { OrderInteraction } from '../../types'
import { cn } from '../../utils/cn'
import { Feedback, type FeedbackState } from './Feedback'
import { FlowButton } from '../ui/flow-button'
import type { InteractionProps } from './InteractionRenderer'

/** Returns a shuffled copy of indices that is guaranteed not to be sorted. */
function shuffledOrder(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  if (arr.every((v, i) => v === i) && n > 1) [arr[0], arr[1]] = [arr[1], arr[0]]
  return arr
}

/**
 * Ordering interaction: steps start shuffled and are reordered by DRAGGING the
 * rows (grip handle shows the affordance), then checked.
 */
export function OrderSteps({
  data,
  onResolved,
}: { data: OrderInteraction } & InteractionProps) {
  const [order, setOrder] = useState<number[]>(() => shuffledOrder(data.steps.length))
  const [checked, setChecked] = useState(false)

  const isCorrect = useMemo(() => order.every((v, i) => v === i), [order])
  const state: FeedbackState = !checked ? 'idle' : isCorrect ? 'correct' : 'wrong'

  return (
    <div>
      <p className="mb-4 font-display text-lg font-bold">{data.prompt}</p>

      <Reorder.Group
        axis="y"
        values={order}
        onReorder={(v) => !checked && setOrder(v)}
        className="flex flex-col gap-2"
      >
        {order.map((stepIdx, pos) => {
          const slotCorrect = checked && stepIdx === pos
          return (
            <Reorder.Item
              key={stepIdx}
              value={stepIdx}
              dragListener={!checked}
              whileDrag={{ scale: 1.03, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.7)' }}
              className={cn(
                'flex select-none items-center gap-3 rounded-xl border bg-black/35 px-3 py-3 backdrop-blur-sm',
                !checked && 'cursor-grab border-white/15 active:cursor-grabbing',
                checked && (slotCorrect ? 'border-emerald-400/60 bg-emerald-500/15' : 'border-rose-400/60 bg-rose-500/15'),
              )}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-sm font-bold leading-none text-charcoal">
                <span className="block translate-y-[1px]">{pos + 1}</span>
              </span>
              <span className="flex-1 text-sm">{data.steps[stepIdx]}</span>
              {!checked && <GripVertical className="h-5 w-5 shrink-0 text-white/35" aria-hidden />}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>

      {!checked && (
        <div className="mt-5 flex justify-start">
          <FlowButton
            text="בדוק סדר"
            onClick={() => {
              setChecked(true)
              onResolved?.(isCorrect)
            }}
          />
        </div>
      )}
      <Feedback state={state} fb={data.fb} />
    </div>
  )
}
