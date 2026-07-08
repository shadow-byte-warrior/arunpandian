import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { ContentProvider } from './context/ContentProvider.jsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </HelmetProvider>
  </StrictMode>,
)
