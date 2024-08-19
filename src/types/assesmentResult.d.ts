type Phoneme = {
  Phoneme: string
  Offset: number
  Duration: number
  PronunciationAssessment: {
    AccuracyScore: number
  }
}
type Monotone = {
  SyllablePitchDeltaConfidence: number
}
type ProsodyError = {
  ErrorTypes: string[]
  BreakLength?: number
}
type ProsodyFeedback = {
  Break: ProsodyError
  Intonation: {
    ErrorTypes: string[]
    Monotone: Monotone
  }
}
type WordPronunciationAssessment = {
  AccuracyScore: number
  ErrorType: string
  Feedback: ProsodyFeedback
}
type Syllable = {
  Syllable: string
  Offset: number
  Duration: number
  PronunciationAssessment: {
    AccuracyScore: number
  }
}
export type AssesmentWord = {
  Word: string
  Offset: number
  Duration: number
  Phonemes: Phoneme[]
  PronunciationAssessment: WordPronunciationAssessment
  Syllables: Syllable[]
}

export type PronunciationAssessment = {
  AccuracyScore: number
  CompletenessScore: number
  FluencyScore: number
  PronScore: number
  ProsodyScore: number
}
export type AssessmentResult = {
  Confidence: number
  Display: string
  ITN: string
  Lexical: string
  MaskedITN: string
  PronunciationAssessment: PronunciationAssessment
  Words: AssesmentWord[]
  id: string
}
