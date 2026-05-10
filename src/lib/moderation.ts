const BLACKLISTED_TERMS = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'dick', 'bastard', 'cum', 'jizz',
  'idiot', 'stupid', 'moron', 'dumb',
  'kill', 'murder', 'poison', 'suicide',
  'drug', 'cocaine', 'heroin', 'meth',
  'spam', 'scam', 'hack',
  'nazi', 'racist', 'sexist',
]

function containsBlacklistedTerm(text: string): string | null {
  const lower = text.toLowerCase()
  for (const term of BLACKLISTED_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, 'i')
    if (regex.test(lower)) return term
  }
  return null
}

export function validateRecipeContent(fields: {
  name: string
  ingredients: string[]
  prepDetails: string
}): { valid: boolean; error?: string } {
  const textsToCheck = [
    fields.name,
    ...fields.ingredients,
    fields.prepDetails,
  ]

  for (const text of textsToCheck) {
    const found = containsBlacklistedTerm(text)
    if (found) {
      return { valid: false, error: `Recipe contains inappropriate content and cannot be posted.` }
    }
  }

  return { valid: true }
}
