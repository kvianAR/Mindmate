const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addSampleMathFlashcards() {
  try {
    const userId = 'sample-user-id'
    
    const mathFlashcards = [
      {
        front: "What is the quadratic formula?",
        back: "x = (-b ± √(b²-4ac)) / 2a, where ax² + bx + c = 0",
        topic: "math",
        difficulty: "medium",
        userId: userId
      },
      {
        front: "What is the derivative of sin(x)?",
        back: "The derivative of sin(x) is cos(x)",
        topic: "math", 
        difficulty: "medium",
        userId: userId
      },
      {
        front: "What is the Pythagorean theorem?",
        back: "In a right triangle, a² + b² = c², where c is the hypotenuse",
        topic: "math",
        difficulty: "easy",
        userId: userId
      },
      {
        front: "What is the integral of x²?",
        back: "∫x² dx = x³/3 + C, where C is the constant of integration",
        topic: "math",
        difficulty: "medium", 
        userId: userId
      },
      {
        front: "What is Euler's formula?",
        back: "e^(iπ) + 1 = 0, or more generally e^(ix) = cos(x) + i·sin(x)",
        topic: "math",
        difficulty: "hard",
        userId: userId
      }
    ]

    console.log('Adding sample math flashcards...')
    
    for (const flashcard of mathFlashcards) {
      await prisma.flashcard.create({
        data: flashcard
      })
      console.log(`Added flashcard: ${flashcard.front}`)
    }
    
    console.log('✅ Sample math flashcards added successfully!')
    
  } catch (error) {
    console.error('❌ Error adding flashcards:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleMathFlashcards()
