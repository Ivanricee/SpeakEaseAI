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
type setConversation = {
  messages: ExtendCoreMessage[]
  textContent: string
  id: string
  url: string
}
type AddUserAssessment = {
  id: string
  userAssessment: AssessmentResult
}
interface State {
  disableMicro: boolean
  chatSetup: chatSetup
  conversation: ExtendCoreMessage[] | []
  assessmentResult: Map<string, AssessmentResult> //AssessmentResult[] | []
  openMenu: boolean
  openAiKey: OpenAiKeyType
  azureKey: AzureKeyType
}
interface Actions {
  setDisableMicro: (enableMicro: boolean) => void
  initConversation: (message: ExtendCoreMessage[]) => void
  setChatSetup: (chatSetup: chatSetup) => void
  setConversation: ({ messages, textContent, id }: setConversation) => void
  addUserAssessment: ({ id, userAssessment }: AddUserAssessment) => void
  setOpenAiKey: (openAI: OpenAiKeyType) => void
  setAzureKey: (azureKey: AzureKeyType) => void
  setOpenMenu: (openMenu: boolean) => void
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
  setConversation: ({ messages, textContent, id, url }: setConversation) =>
    set({
      conversation: [
        ...messages,
        { id, role: 'assistant', content: textContent, url, idAssesment: null },
      ],
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
}))
