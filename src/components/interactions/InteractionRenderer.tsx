import type { Interaction } from '../../types'
import { ClassifySwipe } from './ClassifySwipe'
import { ConnectPairs } from './ConnectPairs'
import { FillBlank } from './FillBlank'
import { MigrationMap } from './MigrationMap'
import { MultipleChoice } from './MultipleChoice'
import { OrderSteps } from './OrderSteps'
import { PickArtifact } from './PickArtifact'
import { Scenario } from './Scenario'
import { TwoTruthsLie } from './TwoTruthsLie'

export interface InteractionProps {
  /** Called when the learner resolves an attempt. `passed` gates progression. */
  onResolved?: (passed: boolean) => void
}

interface RendererProps extends InteractionProps {
  interaction: Interaction
}

/** Dispatches to the right interaction component based on its discriminant. */
export function InteractionRenderer({ interaction, onResolved }: RendererProps) {
  switch (interaction.type) {
    case 'multipleChoice':
      return <MultipleChoice data={interaction} onResolved={onResolved} />
    case 'twoTruthsLie':
      return <TwoTruthsLie data={interaction} onResolved={onResolved} />
    case 'classify':
      return <ClassifySwipe data={interaction} onResolved={onResolved} />
    case 'connect':
      return <ConnectPairs data={interaction} onResolved={onResolved} />
    case 'pickArtifact':
      return <PickArtifact data={interaction} onResolved={onResolved} />
    case 'order':
      return <OrderSteps data={interaction} onResolved={onResolved} />
    case 'map':
      return <MigrationMap data={interaction} onResolved={onResolved} />
    case 'fillBlank':
      return <FillBlank data={interaction} onResolved={onResolved} />
    case 'scenario':
      return <Scenario data={interaction} onResolved={onResolved} />
    default: {
      const _never: never = interaction
      return _never
    }
  }
}
