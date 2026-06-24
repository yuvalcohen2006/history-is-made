/** Per-era visual identity key. Drives background, palette and atmosphere. */
export type EraKey =
  | 'intro'
  | 'stoneTools'
  | 'hunterGatherers'
  | 'fire'
  | 'migration'
  | 'species'
  | 'art'
  | 'transition'
  | 'neolithic'
  | 'domestication'
  | 'villages'
  | 'society'
  | 'metals'
  | 'bronze'
  | 'writing'
  | 'summary'

export interface Artifact {
  /** What the find is called. */
  name: string
  /** "מה הממצא מלמד" — what we learn from it. */
  teaches: string
  /** Short line connecting the find to human life. */
  lifeLink?: string
  /** File name expected under /assets (shows placeholder if missing). */
  image: string
}

export interface Concept {
  term: string
  definition: string
}

export interface Station {
  id: number
  eraKey: EraKey
  title: string
  timeRange: string
  opener: string
  mainText: string
  whatChanged: string
  artifact: Artifact
  concept: Concept
  /** Atmosphere/background brief from the README. */
  atmosphere: string
}

/* ----------------------------- Interactions ----------------------------- */

export type InteractionType =
  | 'multipleChoice'
  | 'twoTruthsLie'
  | 'classify'
  | 'connect'
  | 'pickArtifact'
  | 'order'
  | 'map'
  | 'fillBlank'
  | 'scenario'

/** Rich, progressively-disclosed feedback shown after each question. */
export interface FeedbackContent {
  /** Bold one-line takeaway (the key point to remember). */
  takeaway: string
  /** Detailed "why" explanation (length varies by question). */
  explanation: string
  /** Optional real, accurate "ידעת?" fun fact (click-to-expand). */
  funFact?: string
  /** Short nudge shown on a wrong attempt (no answer reveal). */
  hint?: string
}

interface BaseInteraction {
  /** The challenge prompt shown to the learner. */
  prompt: string
  /** Rich feedback (takeaway + why + optional fun fact + wrong-answer hint). */
  fb: FeedbackContent
}

export interface MultipleChoiceInteraction extends BaseInteraction {
  type: 'multipleChoice'
  options: string[]
  correctIndex: number
}

export interface TwoTruthsLieInteraction extends BaseInteraction {
  type: 'twoTruthsLie'
  /** Exactly three statements; one is false. */
  statements: string[]
  /** Index of the false statement (the "lie"). */
  lieIndex: number
}

export interface ClassifyInteraction extends BaseInteraction {
  type: 'classify'
  /** Labels of the two buckets, e.g. ["פרה-היסטוריה", "היסטוריה"]. */
  buckets: [string, string]
  /** Each item belongs to bucket 0 or 1. */
  items: { label: string; bucket: 0 | 1 }[]
}

export interface ConnectInteraction extends BaseInteraction {
  type: 'connect'
  /** Left column labels. */
  left: string[]
  /** Right column labels. */
  right: string[]
  /** Correct mapping: left index -> right index. */
  pairs: Record<number, number>
}

export interface PickArtifactInteraction extends BaseInteraction {
  type: 'pickArtifact'
  options: { label: string; correct: boolean }[]
}

export interface OrderInteraction extends BaseInteraction {
  type: 'order'
  /** Steps in the CORRECT order. UI shuffles them for the learner. */
  steps: string[]
}

export interface MapRegion {
  /** Region key (used for the SVG shape) and Hebrew label. */
  id: string
  label: string
  /** Whether this region is the correct answer (origin of migration). */
  correct: boolean
}

export interface MapInteraction extends BaseInteraction {
  type: 'map'
  regions: MapRegion[]
}

export interface FillBlankInteraction extends BaseInteraction {
  type: 'fillBlank'
  /** Sentence text before the blank. */
  before: string
  /** Sentence text after the blank. */
  after: string
  /** Word-bank chips; tap the correct one to drop it in the blank. */
  options: string[]
  correctIndex: number
}

export interface ScenarioInteraction extends BaseInteraction {
  type: 'scenario'
  /** The short situation shown on the story card. */
  scenario: string
  options: string[]
  correctIndex: number
}

export type Interaction =
  | MultipleChoiceInteraction
  | TwoTruthsLieInteraction
  | ClassifyInteraction
  | ConnectInteraction
  | PickArtifactInteraction
  | OrderInteraction
  | MapInteraction
  | FillBlankInteraction
  | ScenarioInteraction

/* -------------------------------- Quiz --------------------------------- */

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

/* ------------------------------ Era theme ------------------------------ */

export interface EraTheme {
  key: EraKey
  /** Layered CSS background (gradients/textures). */
  background: string
  /** Accent color for this era (markers, highlights). */
  accent: string
  /** rgba color of the drifting "ethereal shadow" cloud for this era. */
  shadow: string
  /** Foreground text tone: light on dark backgrounds, dark on light. */
  tone: 'light' | 'dark'
  /** Decorative particle style. */
  particles: 'embers' | 'dust' | 'pollen' | 'sparks' | 'none'
}
