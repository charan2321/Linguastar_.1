'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Check your email for the login link!')
      }
    } catch (err) {
      setMessage('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Login</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '0.5rem' }}
        />

        <button 
          onClick={handleLogin} 
          disabled={loading || !email}
          style={{ padding: '0.5rem', cursor: 'pointer' }}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </div>
      
      {message && <p>{message}</p>}
    </div>
  )
}