import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateSummary(topic, content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = `Generate a concise and comprehensive study summary for the following topic: "${topic}". Include key concepts, important points, and main ideas. Make it well-structured and easy to understand.\n\nContent: ${content}`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    throw new Error('Failed to generate summary: ' + error.message)
  }
}

export async function generateFlashcards(topic, content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = `Generate 5-10 flashcards for the topic: "${topic}". For each flashcard, provide a question on the front and a detailed answer on the back. Format the response as a JSON array where each object has "front" and "back" properties. Content: ${content}`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    const cards = []
    const lines = text.split('\n').filter(line => line.trim())
    let currentCard = { front: '', back: '' }
    
    for (const line of lines) {
      if (line.match(/^(Q|Question|Front)[:\-]?\s*/i)) {
        if (currentCard.front) cards.push(currentCard)
        currentCard = { front: line.replace(/^(Q|Question|Front)[:\-]?\s*/i, '').trim(), back: '' }
      } else if (line.match(/^(A|Answer|Back)[:\-]?\s*/i)) {
        currentCard.back = line.replace(/^(A|Answer|Back)[:\-]?\s*/i, '').trim()
      } else if (currentCard.front && !currentCard.back) {
        currentCard.front += ' ' + line.trim()
      } else if (currentCard.front) {
        currentCard.back += ' ' + line.trim()
      }
    }
    if (currentCard.front) cards.push(currentCard)
    
    return cards.length > 0 ? cards : [{ front: 'Question', back: 'Answer' }]
  } catch (error) {
    throw new Error('Failed to generate flashcards: ' + error.message)
  }
}

export async function generateFlashcardsFromTopic(topic, count = 5, difficulty = 'medium') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    let difficultyPrompt = ''
    switch (difficulty) {
      case 'easy':
        difficultyPrompt = 'Focus on basic concepts and fundamental definitions. Keep questions simple and straightforward.'
        break
      case 'hard':
        difficultyPrompt = 'Include advanced concepts, critical thinking questions, and complex scenarios. Make questions challenging.'
        break
      default:
        difficultyPrompt = 'Include a mix of basic and intermediate concepts. Make questions clear but not too simple.'
    }
    
    const prompt = `Generate exactly ${count} study flashcards for the topic: "${topic}". ${difficultyPrompt}

Create engaging and educational flashcards that help students learn effectively. For each flashcard:
- Front: Clear, concise question or prompt
- Back: Detailed, accurate answer with explanations

Format your response as a valid JSON array where each object has exactly "front" and "back" properties.

Example format:
[
  {"front": "What is...?", "back": "The answer is... because..."},
  {"front": "How does...?", "back": "It works by... which means..."}
]

Make sure the questions are diverse, covering different aspects of ${topic}.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      try {
        const flashcards = JSON.parse(jsonMatch[0])
        return flashcards.slice(0, count) // Ensure we return exactly the requested count
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
      }
    }
    
    // Fallback parsing if JSON extraction fails
    const cards = []
    const lines = text.split('\n').filter(line => line.trim())
    let currentCard = { front: '', back: '' }
    
    for (const line of lines) {
      if (line.match(/^(Q|Question|Front)[:\-]?\s*/i)) {
        if (currentCard.front && currentCard.back) cards.push(currentCard)
        currentCard = { front: line.replace(/^(Q|Question|Front)[:\-]?\s*/i, '').trim(), back: '' }
      } else if (line.match(/^(A|Answer|Back)[:\-]?\s*/i)) {
        currentCard.back = line.replace(/^(A|Answer|Back)[:\-]?\s*/i, '').trim()
      } else if (currentCard.front && !currentCard.back) {
        currentCard.front += ' ' + line.trim()
      } else if (currentCard.front && currentCard.back) {
        currentCard.back += ' ' + line.trim()
      }
    }
    if (currentCard.front && currentCard.back) cards.push(currentCard)
    
    // Return the requested number of cards or fallback cards
    if (cards.length >= count) {
      return cards.slice(0, count)
    } else if (cards.length > 0) {
      return cards
    } else {
      // Fallback cards if parsing completely fails
      return Array.from({ length: Math.min(count, 3) }, (_, i) => ({
        front: `Study question ${i + 1} about ${topic}`,
        back: `This is a study answer about ${topic}. Review your materials for more detailed information.`
      }))
    }
  } catch (error) {
    console.error('Error generating flashcards from topic:', error)
    
    // If it's a quota error or any API error, use fallback flashcards
    if (error.message.includes('quota') || error.message.includes('429') || error.message.includes('Too Many Requests')) {
      console.log(`🔄 API quota exceeded, using fallback flashcards for topic: ${topic}`)
      return generateFallbackFlashcards(topic, count, difficulty)
    }
    
    throw new Error('Failed to generate flashcards from topic: ' + error.message)
  }
}

// Fallback function for when AI API is unavailable
function generateFallbackFlashcards(topic, count = 5, difficulty = 'medium') {
  const topicLower = topic.toLowerCase()
  
  // Pre-defined flashcard templates for common topics
  const flashcardTemplates = {
    math: [
      { front: "What is the quadratic formula?", back: "x = (-b ± √(b²-4ac)) / 2a, used to solve equations of the form ax² + bx + c = 0" },
      { front: "What is the Pythagorean theorem?", back: "In a right triangle, a² + b² = c², where c is the hypotenuse and a, b are the other two sides" },
      { front: "What is the derivative of sin(x)?", back: "The derivative of sin(x) is cos(x)" },
      { front: "What is the integral of x²?", back: "∫x² dx = x³/3 + C, where C is the constant of integration" },
      { front: "What is Euler's formula?", back: "e^(iπ) + 1 = 0, or more generally e^(ix) = cos(x) + i·sin(x)" },
      { front: "What is the slope formula?", back: "Slope = (y₂ - y₁) / (x₂ - x₁), representing the rate of change between two points" },
      { front: "What is the area of a circle?", back: "A = πr², where r is the radius of the circle" }
    ],
    science: [
      { front: "What is Newton's first law?", back: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force" },
      { front: "What is the chemical formula for water?", back: "H₂O - two hydrogen atoms bonded to one oxygen atom" },
      { front: "What is photosynthesis?", back: "The process by which plants convert sunlight, CO₂, and water into glucose and oxygen: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂" },
      { front: "What is DNA?", back: "Deoxyribonucleic acid - the molecule that carries genetic information in living organisms" },
      { front: "What is the speed of light?", back: "Approximately 299,792,458 meters per second in a vacuum (c = 3.0 × 10⁸ m/s)" }
    ],
    history: [
      { front: "When did World War II end?", back: "September 2, 1945, with Japan's formal surrender aboard the USS Missouri" },
      { front: "Who was the first President of the United States?", back: "George Washington (1789-1797)" },
      { front: "When did the American Civil War begin?", back: "April 12, 1861, with the attack on Fort Sumter" },
      { front: "What year did the Berlin Wall fall?", back: "November 9, 1989" },
      { front: "When was the Declaration of Independence signed?", back: "July 4, 1776" }
    ],
    english: [
      { front: "What is a metaphor?", back: "A figure of speech that compares two unlike things without using 'like' or 'as' (e.g., 'Time is money')" },
      { front: "What is alliteration?", back: "The repetition of the same consonant sound at the beginning of words in close succession" },
      { front: "What is the difference between 'your' and 'you're'?", back: "'Your' is possessive (your book), 'you're' is a contraction of 'you are'" },
      { front: "What is a protagonist?", back: "The main character in a story, typically the hero or central figure around whom the plot revolves" },
      { front: "What is iambic pentameter?", back: "A poetic meter with five iambic feet per line, each foot having an unstressed syllable followed by a stressed syllable" }
    ]
  }
  
  // Find matching flashcards for the topic
  let selectedFlashcards = []
  
  if (topicLower.includes('math') || topicLower.includes('algebra') || topicLower.includes('calculus')) {
    selectedFlashcards = flashcardTemplates.math
  } else if (topicLower.includes('science') || topicLower.includes('physics') || topicLower.includes('chemistry') || topicLower.includes('biology')) {
    selectedFlashcards = flashcardTemplates.science
  } else if (topicLower.includes('history') || topicLower.includes('social')) {
    selectedFlashcards = flashcardTemplates.history
  } else if (topicLower.includes('english') || topicLower.includes('literature') || topicLower.includes('writing')) {
    selectedFlashcards = flashcardTemplates.english
  } else {
    // Generic fallback for unknown topics
    selectedFlashcards = [
      { front: `What are the key concepts in ${topic}?`, back: `The key concepts in ${topic} include fundamental principles and important definitions that form the foundation of understanding.` },
      { front: `Why is ${topic} important?`, back: `${topic} is important because it provides essential knowledge and skills that are valuable for academic and practical applications.` },
      { front: `What are common applications of ${topic}?`, back: `Common applications of ${topic} can be found in various fields and real-world scenarios where this knowledge is applied.` },
      { front: `What should beginners know about ${topic}?`, back: `Beginners should focus on understanding the basic principles and building a solid foundation in ${topic} fundamentals.` },
      { front: `How can you improve your understanding of ${topic}?`, back: `Improve your understanding through regular practice, reviewing key concepts, and applying knowledge to solve problems.` }
    ]
  }
  
  // Shuffle and select the requested number of flashcards
  const shuffled = selectedFlashcards.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export async function generateRecommendations(userNotes, userSessions) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const topics = [...new Set(userNotes.map(n => n.topic).filter(Boolean))]
    const recentTopics = userSessions.slice(0, 10).map(s => s.topic).filter(Boolean)
    
    const prompt = `Based on the following study history, suggest 3-5 topics or areas the student should focus on next. Be specific and actionable.\n\nTopics studied: ${topics.join(', ')}\nRecent sessions: ${recentTopics.join(', ')}\n\nProvide recommendations as a simple list, one per line.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().split('\n').filter(line => line.trim()).slice(0, 5)
  } catch (error) {
    return []
  }
}