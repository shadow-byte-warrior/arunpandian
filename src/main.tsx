import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ContentProvider } from './context/ContentProvider.jsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </StrictMode>,
)
