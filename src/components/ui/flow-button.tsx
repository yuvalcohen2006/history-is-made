import { ArrowLeft } from 'lucide-react'
import { cn } from '../../utils/cn'

interface FlowButtonProps {
  text: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

/**
 * Project-wide CTA. Outlined accent pill; on hover an accent circle expands to
 * fill it and the text/arrows flip to dark. Uses the current era's --accent.
 * RTL-friendly (arrows point left = "forward" in Hebrew).
 */
export function FlowButton({ text, onClick, disabled, type = 'button', className }: FlowButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn('flow-btn', className)}>
      <ArrowLeft className="flow-btn__arrow flow-btn__arrow--l" strokeWidth={2} />
      <span className="flow-btn__text">{text}</span>
      <span className="flow-btn__circle" aria-hidden />
      <ArrowLeft className="flow-btn__arrow flow-btn__arrow--r" strokeWidth={2} />
    </button>
  )
}

export default FlowButton
