import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/auth'

export async function POST(request) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, duration, notesStudied, flashcardsReviewed } = await request.json()

    if (!duration) {
      return NextResponse.json(
        { error: 'Duration is required' },
        { status: 400 }
      )
    }

    const session = await prisma.studySession.create({
      data: {
        topic: topic || null,
        duration: parseInt(duration),
        notesStudied: notesStudied || [],
        flashcardsReviewed: parseInt(flashcardsReviewed) || 0,
        userId
      }
    })

    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

