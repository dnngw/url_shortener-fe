import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import AuthProvider from './providers/AuthProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename='/app'>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster richColors position='top-right'/>
    </BrowserRouter>
  </StrictMode>,
)
