import { CoreMessage } from 'ai'
import { create } from 'zustand'

type OpenAiType = {
  key: string | null
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
}
interface State {
  conversation: ExtendCoreMessage[] | []
  openMenu: boolean
  openAiKey: OpenAiType
  chatSetup: chatSetup
}
type setConversation = {
  messages: ExtendCoreMessage[]
  textContent: string
  id: string
}
interface Actions {
  setOpenAiKey: (openAI: OpenAiType) => void
  setChatSetup: (chatSetup: chatSetup) => void
  setOpenMenu: (openMenu: boolean) => void
  setConversation: ({ messages, textContent, id }: setConversation) => void
  initConversation: (message: ExtendCoreMessage[]) => void
}

export const useAppStore = create<State & Actions>((set) => ({
  openMenu: false,
  openAiKey: { key: null },
  chatSetup: {
    model: '',
    topic: '',
    level: '',
    role: '',
  },
  conversation: [],
  setOpenAiKey: (openAI: OpenAiType) =>
    set((prevState) => ({
      openAiKey: { ...prevState.openAiKey, ...openAI },
    })),
  setChatSetup: (chatSetup: chatSetup) =>
    set((prevState) => ({
      chatSetup: { ...prevState.chatSetup, ...chatSetup },
    })),
  setOpenMenu: (openMenu: boolean) =>
    set({
      openMenu: openMenu,
    }),
  setConversation: ({ messages, textContent, id }: setConversation) =>
    set({
      conversation: [...messages, { id, role: 'assistant', content: textContent }],
    }),
  initConversation: (message: ExtendCoreMessage[]) =>
    set((prevState) => ({
      conversation: [...message],
    })),
}))
