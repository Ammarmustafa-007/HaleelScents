import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { ClerkProvider } from '@clerk/clerk-react'
import { CartContext } from './context/Cartcontext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'


// Import your Publishable Key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// if (!PUBLISHABLE_KEY) {
//   throw new Error('Missing Publishable Key')
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {/* // <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}
      <CartContext>
      <App />
      </CartContext>
    {/* </ClerkProvider> */}
    </AuthProvider>
    
  </StrictMode>,
)
