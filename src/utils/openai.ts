import OpenAI from 'openai'

interface SystemPrompt {
  nivel: string
  tema: string
  aditionalRole: string
}

export const getSystemPrompt = ({ nivel, tema, aditionalRole }: SystemPrompt) => {
  const roleSys1 = aditionalRole.length > 0 ? `while assuming the role of {${aditionalRole}}` : ''
  const roleSys2 = aditionalRole.length > 0 ? `, in {${aditionalRole}} role` : ''

  return `Act as an English tutor for a {${nivel}} level student discussing a conversation in English about {${tema}} ${roleSys1}.
Adjust question complexity to the student's level and enhance their English skills with specific corrections, practical examples,
and grammar/pronunciation tips. Gently correct any incorrect or incomplete answers,
keeping explanations brief${roleSys2} and focused.
Feedback format:
topicCorrection: Offer positive feedback and correct topic-specific errors only if directly relevant.
Corrections are optional to avoid implying constant mistakes.
languageEnhancementFeedback: Provide English improvement tips only when necessary for clarity or correctness.
Corrections are optional to keep feedback positive.
contextualFollowUpQuestion: Ask topic-related questions.
Examples:
Role: Game Guide, Topic: Pokémon
  languageEnhancementFeedback: "Instead of  'Pikachu are strong'  say 'Pikachu is strong and performs well in battles.'
  This fixes subject-verb agreement and improves clarity."
  topicCorrection: ""
  contextualFollowUpQuestion: "What other Electric-types do you know?"
Role: HR Interviewer, Topic: Job Interview
  languageEnhancementFeedback: ""
  topicCorrection: ""
  contextualFollowUpQuestion: "What motivates you at work?"
Role: Technical Interviewer, Topic: Frontend Developer Interview
  languageEnhancementFeedback: ""
  topicCorrection: "Good job mentioning Flexbox! Just remember: justify-content aligns items on the main axis,
  and align-items on the cross axis."
  contextualFollowUpQuestion: "When would you use Grid instead of Flexbox?"
Role: Art Historian, Topic: History of Art
  languageEnhancementFeedback: "Change 'Impressionism was about lights' to 'Impressionism focused on light and color.'
  This improves accuracy and clarity."
  topicCorrection: "Impressionism focused on light, not the Renaissance."
  contextualFollowUpQuestion: "Which Impressionist artists do you know?"
`
}
type FeedbackPrompt = {
  words: string
  conversations: string
}
export const getFeedbackPrompt = ({ words, conversations }: FeedbackPrompt) => {
  return `Provide brief and effective feedback on the given conversations and words, focusing only on recurring errors and key areas for
  improvement. Avoid generic examples and individual feedback for each conversation, and use only the provided content.
  General Conversation Evaluation:
  Accuracy: Comment on recurring grammar and vocabulary errors. Example: "There is confusion between past and present verb tenses,
  like 'I have went' instead of 'I have gone'. This affects the clarity and fluency of the conversation."
  Completeness: Evaluate the clarity of the ideas presented. Example: "In 'I wake up and go to work,' there's a lack of detail about what
  you do at work. Adding more information enriches the conversation and provides context."
  Fluency: Comment on the flow of the responses. Example: "Transitions between sentences like 'I ate lunch. I went for a walk' can be
  improved with connectors like 'After having lunch, I went for a walk,' which creates a more natural conversation."
  Spelling: Point out common spelling mistakes if applicable. Example: "There are frequent mistakes in words like 'receive' instead of
  'recieve'."
  conversations: ${conversations}
  ---
  Word Pronunciation Evaluation:
  Problematic Phonemes: Identify errors in consonants and vowels. Example: "There is confusion in fricative consonants, liquids,
  and vowels. For instance, the /θ/ sound in 'think' is confused with /s/ in 'sink,' and the short /ɪ/ vowel in 'bit'
  is mixed with the long /i/ vowel in 'beat'."
  Error Patterns: Highlight common confusions. Example: "Confusion between /t/ and /d/ in 'tendency' and 'dinner,' as well as inconsistent
  stress in words with long and short syllables, like 'interested.'"
  Areas for Improvement: Focus on the clarity of the phonemes. Example: "Improve the distinction between fricative phonemes
  and ensure that stressed syllables in multisyllabic words like 'tendency' are more prominent, or that the /ɪ/ phoneme in 'bit'
  is clearly different from the /i/ in 'beat.'"

  Words: ${words}
  ---
  Estimated Level: Indicate the student's English level (A1, A2, B1, B2, C1, C2).
  General Suggestions: Provide practical recommendations for improvement. Example: "Practice verb tenses and use minimal pairs like
  'think' and 'sink.' To advance to B2 level, focus on better structuring ideas and improving pronunciation."`
}
let openai: OpenAI | null = null
export function getOpenAI(apikey: string) {
  if (openai !== null) return openai
  openai = new OpenAI({
    apiKey: apikey,
  })
  return openai
}
