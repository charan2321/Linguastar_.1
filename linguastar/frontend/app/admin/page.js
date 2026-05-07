'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminPage() {
  const [allowed, setAllowed] = useState(false)

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState(null)

  const [books, setBooks] = useState([])

  useEffect(() => {
    checkAdmin()
    loadBooks()
  }, [])

  const checkAdmin = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setAllowed(true)
    }
  }

  const loadBooks = async () => {
    const { data } = await supabase
      .from('books')
      .select('*')

    setBooks(data || [])
  }

  const uploadBook = async () => {
    if (!file || !title || !price) {
      alert('Fill all fields')
      return
    }

    const formData = new FormData()

    formData.append('file', file)
    formData.append('title', title)
    formData.append('price', price)

    const res = await fetch('/api/uploadBook', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (data.success) {
      alert('Uploaded Successfully')

      setTitle('')
      setPrice('')
      setFile(null)

      loadBooks()
    } else {
      alert(data.error)
    }
  }

  if (!allowed) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-500">
          Access Denied
        </h1>
      </div>
    )
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        🛠 Admin Panel
      </h1>

      <div className="border p-5 rounded-xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Upload Book
        </h2>

        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        <button
          onClick={uploadBook}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Uploaded Books
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {books.map((book) => (
          <div
            key={book.id}
            className="border p-4 rounded-xl shadow"
          >
            <h3 className="font-semibold text-lg">
              {book.title}
            </h3>

            <p className="text-gray-500">
              ₹{book.price}
            </p>

            <p className="text-xs mt-2 break-all">
              {book.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}