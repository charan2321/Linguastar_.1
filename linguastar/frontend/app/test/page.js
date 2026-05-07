// app/test/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function TestPage() {
  const [bookId, setBookId] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleOpenBook = async () => {
    try {
      setLoading(true)

      if (!bookId) {
        alert('Please enter a Book ID')
        return
      }

      const { data, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !data?.session) {
        alert('No active session found. Please log in first.')
        return
      }

      const token = data.session.access_token

      const response = await fetch('/api/getBookAccess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId: bookId.trim() })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch book')
      }

      if (result.url) {
        router.push(`/reader?bookId=${bookId}`)
      } else {
        throw new Error('No URL returned from server')
      }

    } catch (err) {
      alert(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test Book Access</h1>

      <input
        type="text"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        placeholder="Enter Book UUID"
        style={{ padding: '0.5rem', width: '350px', marginRight: '10px' }}
      />

      <button
        onClick={handleOpenBook}
        disabled={loading}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        {loading ? 'Opening...' : 'Open Book'}
      </button>
    </div>
  )
}