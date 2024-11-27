import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/dashboard/dashboard.jsx'
import Connexion from './pages/connexion/connexion.jsx'
import Inscription from './pages/inscription/inscription.jsx'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// Createur de l'objet BrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/connexion',
    element: <Connexion />
  },
  {
    path: '/inscription',
    element: <Inscription />
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Toaster />
   <RouterProvider router={router}> </RouterProvider>
    </QueryClientProvider>
  </StrictMode>,
)
