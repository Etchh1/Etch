'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useFeatureFlag, useConfigValue } from '@/lib/statsig-client'

export default function Home() {
  const [status, setStatus] = useState('Checking connection...')
  const welcomeMessage = useFeatureFlag('welcome_message')
  const welcomeText = useConfigValue('welcome_text')

  useEffect(() => {
    // Test Supabase connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

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
        <h1 className="text-4xl font-bold mb-8">
          {welcomeMessage ? welcomeText?.value || 'Welcome to Etch' : 'Welcome to Etch'}
        </h1>
        <div className="text-xl space-y-4">
          <p>Supabase Status: {status}</p>
          <p>Statsig Status: {welcomeMessage ? '✅ Feature flag enabled' : '❌ Feature flag disabled'}</p>
        </div>
      </div>
    </main>
  )
} 