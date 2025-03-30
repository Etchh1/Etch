'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useFeatureFlag, useConfigValue, StatsigWrapper } from '@/lib/statsig-client'

function WelcomeMessage() {
  const welcomeMessage = useFeatureFlag('welcome_message')
  const welcomeText = useConfigValue('welcome_text')

  return (
    <h1 className="text-4xl font-bold mb-8">
      {welcomeMessage ? String(welcomeText || 'Welcome to Etch') : 'Welcome to Etch'}
    </h1>
  )
}

function StatusMessages() {
  const welcomeMessage = useFeatureFlag('welcome_message')
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    // Test Supabase connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const checkConnection = async () => {
      try {
        await supabase.from('_tables').select('*').limit(1)
        setStatus('✅ Successfully connected to Supabase!')
      } catch (error) {
        setStatus(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="text-xl space-y-4">
      <p>Supabase Status: {status}</p>
      <p>Statsig Status: {welcomeMessage ? '✅ Feature flag enabled' : '❌ Feature flag disabled'}</p>
    </div>
  )
}

export default function Home() {
  return (
    <StatsigWrapper>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <WelcomeMessage />
          <StatusMessages />
        </div>
      </main>
    </StatsigWrapper>
  )
} 