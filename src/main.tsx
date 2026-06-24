import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AudioProvider } from './audio/AudioProvider'
import { ProgressProvider } from './progress/ProgressProvider'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </ProgressProvider>
  </StrictMode>,
)
