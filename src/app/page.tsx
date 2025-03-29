'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Test the connection
    supabase.from('_tables').select('*').limit(1)
      .then(() => {
        setStatus('✅ Successfully connected to Supabase!')
      })
      .catch((error) => {
        setStatus(`❌ Connection error: ${error.message}`)
      })
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Etch</h1>
        <div className="text-xl">
          <p>Supabase Status: {status}</p>
        </div>
      </div>
    </main>
  )
} 