'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function Reader() {

    const { id } = useParams()

    const [url, setUrl] = useState(null)
    const [loading, setLoading] = useState(true)

    const [numPages, setNumPages] = useState(null)

    const [userEmail, setUserEmail] = useState('Protected User')

    // =========================================
    // BASIC PROTECTION
    // =========================================

    useEffect(() => {

        const disableInspect = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
                (e.ctrlKey && e.key === 'U') ||
                (e.ctrlKey && e.key === 'S') ||
                (e.ctrlKey && e.key === 'P')
            ) {
                e.preventDefault()
            }
        }

        const disableRightClick = (e) => {
            e.preventDefault()
        }

        window.addEventListener('keydown', disableInspect)
        window.addEventListener('contextmenu', disableRightClick)

        return () => {
            window.removeEventListener('keydown', disableInspect)
            window.removeEventListener('contextmenu', disableRightClick)
        }

    }, [])

    // =========================================
    // LOAD BOOK
    // =========================================

    useEffect(() => {

        const loadBook = async () => {

            try {

                const {
                    data: { session }
                } = await supabase.auth.getSession()

                if (!session) {
                    alert('Please login first')
                    return
                }

                setUserEmail(session.user.email)

                const res = await fetch('/api/getBookAccess', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({
                        bookId: id
                    })
                })

                const data = await res.json()

                if (!res.ok) {
                    alert(data.error || 'Failed to load book')
                    return
                }

                setUrl(data.url)

            } catch (err) {
                console.error(err)
                alert('Something went wrong')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadBook()
        }

    }, [id])

    // =========================================
    // PDF LOAD
    // =========================================

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
    }

    // =========================================
    // UI
    // =========================================

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white">
                Loading Book...
            </div>
        )
    }

    if (!url) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-red-500">
                Failed to load PDF
            </div>
        )
    }

    return (
        <div className="bg-gray-900 min-h-screen p-5 relative overflow-hidden">

            {/* WATERMARK OVERLAY */}

            <div className="fixed inset-0 pointer-events-none z-50 opacity-10">

                {Array.from({ length: 40 }).map((_, i) => (

                    <div
                        key={i}
                        className="absolute text-white text-xl font-bold rotate-[-30deg]"
                        style={{
                            top: `${(i % 10) * 12}%`,
                            left: `${(i % 5) * 20}%`
                        }}
                    >
                        {userEmail}
                    </div>

                ))}

            </div>

            <div className="max-w-5xl mx-auto relative z-10">

                <div className="bg-black text-white p-4 rounded-xl mb-5 flex justify-between items-center sticky top-0 z-20">

                    <h1 className="font-bold text-lg">
                        Secure Reader
                    </h1>

                    <p className="text-sm text-gray-400">
                        Protected Content
                    </p>

                </div>

                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="text-white">
                            Loading PDF...
                        </div>
                    }
                >

                    {Array.from(
                        new Array(numPages),
                        (el, index) => (

                            <div
                                key={`page_${index + 1}`}
                                className="mb-5 flex justify-center relative"
                            >

                                <Page
                                    pageNumber={index + 1}
                                    width={900}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />

                            </div>

                        )
                    )}

                </Document>

            </div>

        </div>
    )
}