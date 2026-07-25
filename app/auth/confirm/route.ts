import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

function getSafeNextPath(value: string | null) {
  if (!value) {
    return '/profile'
  }

  // Prevent redirects to another website.
  if (!value.startsWith('/') || value.startsWith('//')) {
    return '/profile'
  }

  return value
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const code = requestUrl.searchParams.get('code')
  const nextPath = getSafeNextPath(
    requestUrl.searchParams.get('next'),
  )

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=confirmation', requestUrl.origin),
    )
  }

  const supabase = await createClient()

  const { error } =
    await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Email confirmation failed:', error.message)

    return NextResponse.redirect(
      new URL('/login?error=confirmation', requestUrl.origin),
    )
  }

  return NextResponse.redirect(
    new URL(nextPath, requestUrl.origin),
  )
}