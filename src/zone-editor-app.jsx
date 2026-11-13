import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ZoneEditor from './components/ZoneEditor'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ZoneEditor />
  </StrictMode>,
)
