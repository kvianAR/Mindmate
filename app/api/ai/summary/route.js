import { NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { generateSummary } from '@/lib/gemini'

export async function POST(request) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, content } = await request.json()

    if (!topic || !content) {
      return NextResponse.json(
        { error: 'Topic and content are required' },
        { status: 400 }
      )
    }

    const summary = await generateSummary(topic, content)

    return NextResponse.json({ summary })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    )
  }
}

