import type { EraKey, EraTheme } from '../types'

/**
 * Per-era visual identity. Backgrounds are layered CSS gradients tuned to the
 * README's mood guide ("סגנון עיצוב לפי תקופות"). The `shadow` color drives the
 * drifting EtherealShadow cloud (blended with 'screen'), so each era's smoke/light
 * takes on its own palette. Real photo backgrounds, when supplied, layer on top.
 */
export const eraThemes: Record<EraKey, EraTheme> = {
  intro: {
    key: 'intro',
    background:
      'radial-gradient(120% 100% at 50% 0%, #2a211a 0%, #15110e 55%, #0c0908 100%)',
    accent: '#e2700f',
    shadow: 'rgba(226,112,15,0.55)',
    tone: 'light',
    particles: 'embers',
  },
  stoneTools: {
    key: 'stoneTools',
    background:
      'linear-gradient(180deg, #c98a4a 0%, #b9803f 30%, #8a6233 70%, #5e4426 100%)',
    accent: '#f2c14e',
    shadow: 'rgba(150,110,50,0.4)',
    tone: 'dark',
    particles: 'dust',
  },
  hunterGatherers: {
    key: 'hunterGatherers',
    background:
      'linear-gradient(180deg, #9fa86a 0%, #8a8f55 35%, #6f7444 70%, #4f5331 100%)',
    accent: '#e8d27a',
    shadow: 'rgba(120,130,70,0.4)',
    tone: 'dark',
    particles: 'dust',
  },
  fire: {
    key: 'fire',
    background:
      'radial-gradient(90% 80% at 50% 75%, #6b2f0c 0%, #3a1606 45%, #160a05 100%)',
    accent: '#ff7a18',
    shadow: 'rgba(255,110,20,0.6)',
    tone: 'light',
    particles: 'embers',
  },
  migration: {
    key: 'migration',
    background:
      'linear-gradient(180deg, #d9b98a 0%, #c79f6e 40%, #9a7a52 75%, #6d5639 100%)',
    accent: '#f0d9a8',
    shadow: 'rgba(150,120,80,0.4)',
    tone: 'dark',
    particles: 'dust',
  },
  species: {
    key: 'species',
    background:
      'linear-gradient(180deg, #46555f 0%, #38454e 40%, #28323a 75%, #161d22 100%)',
    accent: '#9cc3d6',
    shadow: 'rgba(90,130,165,0.45)',
    tone: 'light',
    particles: 'dust',
  },
  art: {
    key: 'art',
    background:
      'radial-gradient(100% 90% at 50% 40%, #7a4a28 0%, #5b3620 50%, #2f1c11 100%)',
    accent: '#e6a14c',
    shadow: 'rgba(200,120,50,0.5)',
    tone: 'light',
    particles: 'embers',
  },
  transition: {
    key: 'transition',
    background:
      'linear-gradient(180deg, #aebfc2 0%, #93a79f 35%, #7c937e 70%, #5d7560 100%)',
    accent: '#cfe3d0',
    shadow: 'rgba(120,150,130,0.35)',
    tone: 'dark',
    particles: 'pollen',
  },
  neolithic: {
    key: 'neolithic',
    background:
      'linear-gradient(180deg, #d7e08a 0%, #aecb6a 35%, #7fa64f 70%, #557336 100%)',
    accent: '#f4e9a0',
    shadow: 'rgba(120,160,70,0.4)',
    tone: 'dark',
    particles: 'pollen',
  },
  domestication: {
    key: 'domestication',
    background:
      'linear-gradient(180deg, #cdb877 0%, #b2a05f 35%, #8c8a4c 70%, #5f6a36 100%)',
    accent: '#efe2a0',
    shadow: 'rgba(150,140,70,0.4)',
    tone: 'dark',
    particles: 'pollen',
  },
  villages: {
    key: 'villages',
    background:
      'linear-gradient(180deg, #c9a273 0%, #a9824f 40%, #7e5f39 75%, #523d25 100%)',
    accent: '#eccf94',
    shadow: 'rgba(150,100,60,0.4)',
    tone: 'dark',
    particles: 'dust',
  },
  society: {
    key: 'society',
    background:
      'linear-gradient(180deg, #bd9466 0%, #9c7748 40%, #74552f 75%, #4a361f 100%)',
    accent: '#e6c184',
    shadow: 'rgba(160,120,70,0.4)',
    tone: 'dark',
    particles: 'dust',
  },
  metals: {
    key: 'metals',
    background:
      'radial-gradient(90% 80% at 50% 70%, #7a3410 0%, #4a1f0a 50%, #1c0d06 100%)',
    accent: '#ff9d3c',
    shadow: 'rgba(255,110,30,0.55)',
    tone: 'light',
    particles: 'sparks',
  },
  bronze: {
    key: 'bronze',
    background:
      'radial-gradient(95% 85% at 50% 65%, #8a6a30 0%, #5c4720 50%, #271d0d 100%)',
    accent: '#e7b860',
    shadow: 'rgba(200,150,60,0.5)',
    tone: 'light',
    particles: 'sparks',
  },
  writing: {
    key: 'writing',
    background:
      'linear-gradient(180deg, #efe6d2 0%, #ddcfb2 40%, #c4b48f 75%, #a4906a 100%)',
    // bright electric cyan — marks the shift into the written/historic world
    accent: '#22d3ee',
    shadow: 'rgba(34,211,238,0.34)',
    tone: 'dark',
    particles: 'none',
  },
  summary: {
    key: 'summary',
    background:
      'linear-gradient(180deg, #f4efe4 0%, #e6ddca 45%, #cfc2a4 100%)',
    accent: '#f0469b',
    shadow: 'rgba(240,70,155,0.3)',
    tone: 'dark',
    particles: 'none',
  },
}

/** Ambient audio groups — a few shared loops mapped across related eras. */
export const ambientByEra: Record<EraKey, string> = {
  intro: 'amb-cave.mp3',
  stoneTools: 'amb-savanna.mp3',
  hunterGatherers: 'amb-savanna.mp3',
  fire: 'amb-fire.mp3',
  migration: 'amb-wind.mp3',
  species: 'amb-cave.mp3',
  art: 'amb-cave.mp3',
  transition: 'amb-water.mp3',
  neolithic: 'amb-field.mp3',
  domestication: 'amb-field.mp3',
  villages: 'amb-village.mp3',
  society: 'amb-village.mp3',
  metals: 'amb-forge.mp3',
  bronze: 'amb-forge.mp3',
  writing: 'amb-museum.mp3',
  summary: 'amb-museum.mp3',
}
