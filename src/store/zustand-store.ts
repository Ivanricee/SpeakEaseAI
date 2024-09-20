import { AssessmentResult } from '@/types/assesmentResult'
import { create } from 'zustand'

type OpenAiKeyType = {
  key: string | null
}
type AzureKeyType = {
  key: string | null
  isEnable: boolean
  region: string | null
}
type chatSetup = {
  model: string
  topic: string
  level: string
  role: string
}
export type ExtendCoreMessage = {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool' | 'function'
  content: string
  url: string
  idAssesment: string | null
}
type UserConversation = {
  //messages: ExtendCoreMessage[]
  textContent: string
  id: string
  idAssesment: string | null
  url: string
}
type AssistantConv = {
  id: string
  textContent: string
  url?: string | null
}
type AddUserAssessment = {
  id: string
  userAssessment: AssessmentResult
}
export type LowScoredWord = {
  word: string
  score: number
  phonemes: {
    syllable: string
    score: number
  }[]
}
interface State {
  disableMicro: boolean
  chatSetup: chatSetup
  conversation: ExtendCoreMessage[] | []
  assessmentResult: Map<string, AssessmentResult> //AssessmentResult[] | []
  openMenu: boolean
  openAiKey: OpenAiKeyType
  azureKey: AzureKeyType
  lowScoredWords: LowScoredWord[]
}
interface Actions {
  setDisableMicro: (enableMicro: boolean) => void
  initConversation: (message: ExtendCoreMessage[]) => void
  setChatSetup: (chatSetup: chatSetup) => void
  setUserConversation: ({ textContent, id, idAssesment, url }: UserConversation) => void
  setAssistantConversation: ({ id, textContent, url }: AssistantConv) => void
  addUserAssessment: ({ id, userAssessment }: AddUserAssessment) => void
  setOpenAiKey: (openAI: OpenAiKeyType) => void
  setAzureKey: (azureKey: AzureKeyType) => void
  setOpenMenu: (openMenu: boolean) => void
  setLowScoredWord: (lowScoredWord: LowScoredWord) => void
}

export const useAppStore = create<State & Actions>((set) => ({
  disableMicro: false,
  openMenu: false,
  openAiKey: { key: null },
  azureKey: { key: null, isEnable: false, region: null },
  chatSetup: {
    model: '',
    topic: '',
    level: '',
    role: '',
  },
  conversation: [],
  assessmentResult: new Map(),
  lowScoredWords: [],
  setDisableMicro: (disableMicro: boolean) => set({ disableMicro }),
  setOpenAiKey: (openAI: OpenAiKeyType) =>
    set((prevState) => ({
      openAiKey: { ...prevState.openAiKey, ...openAI },
    })),
  setAzureKey: (azureKey: AzureKeyType) =>
    set((prevState) => ({
      azureKey: { ...prevState.azureKey, ...azureKey },
    })),
  setChatSetup: (chatSetup: chatSetup) =>
    set((prevState) => ({
      chatSetup: { ...prevState.chatSetup, ...chatSetup },
    })),
  setOpenMenu: (openMenu: boolean) =>
    set({
      openMenu: openMenu,
    }),
  setUserConversation: ({ textContent, id, idAssesment, url }: UserConversation) =>
    set((prevState) => {
      return {
        conversation: [
          ...prevState.conversation,
          { id, role: 'user', content: textContent, url, idAssesment: idAssesment },
        ],
      }
    }),
  setAssistantConversation: ({ id, textContent, url = null }: AssistantConv) =>
    set((prevState) => {
      //update
      const foundIndex = prevState.conversation.findIndex((item) => item.id === id)
      if (foundIndex !== -1) {
        const updateConversation = [...prevState.conversation]
        updateConversation[foundIndex] = {
          ...updateConversation[foundIndex],
          ...(url ? { url } : { content: textContent }),
        }
        return { conversation: updateConversation }
      }
      //add
      return {
        conversation: [
          ...prevState.conversation,
          { id, idAssesment: null, role: 'assistant', content: textContent, url: '' },
        ],
      }
    }),
  addUserAssessment: ({ id, userAssessment }: AddUserAssessment) =>
    set((prevState) => ({
      conversation: prevState.conversation.map((item) =>
        item.id === id ? { ...item, idAssesment: id } : item
      ),
      assessmentResult: new Map(prevState.assessmentResult).set(id, userAssessment),
    })),
  initConversation: (message: ExtendCoreMessage[]) =>
    set((prevState) => ({
      conversation: [...message],
    })),
  setLowScoredWord: (lowScoredWord: LowScoredWord) =>
    set((prevState) => ({
      lowScoredWords: [...prevState.lowScoredWords, lowScoredWord],
    })),
}))
