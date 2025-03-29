'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { getFeatureFlag, getConfigValue } from '@/lib/statsig'

export default function Home() {
  const [status, setStatus] = useState('Checking connection...')
  const [statsigStatus, setStatsigStatus] = useState('Checking Statsig...')

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

    // Test Statsig
    const checkStatsig = async () => {
      try {
        const isEnabled = await getFeatureFlag('welcome_message')
        const message = getConfigValue('welcome_text', 'Welcome to Etch')
        setStatsigStatus(`✅ Statsig connected! Feature flag: ${isEnabled}, Message: ${message}`)
      } catch (error) {
        setStatsigStatus(`❌ Statsig error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    checkStatsig()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Etch</h1>
        <div className="text-xl space-y-4">
          <p>Supabase Status: {status}</p>
          <p>Statsig Status: {statsigStatus}</p>
        </div>
      </div>
    </main>
  )
} 