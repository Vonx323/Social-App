import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SocialApp from './SocialApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocialApp />
  </StrictMode>
)