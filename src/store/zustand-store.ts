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
  url: string
}
type setConversation = {
  messages: ExtendCoreMessage[]
  textContent: string
  id: string
  url: string
}
interface State {
  disableMicro: boolean
  chatSetup: chatSetup
  conversation: ExtendCoreMessage[] | []
  openMenu: boolean
  openAiKey: OpenAiType
}
interface Actions {
  setDisableMicro: (enableMicro: boolean) => void
  initConversation: (message: ExtendCoreMessage[]) => void
  setChatSetup: (chatSetup: chatSetup) => void
  setConversation: ({ messages, textContent, id }: setConversation) => void
  setOpenAiKey: (openAI: OpenAiType) => void
  setOpenMenu: (openMenu: boolean) => void
}

export const useAppStore = create<State & Actions>((set) => ({
  disableMicro: false,
  openMenu: false,
  openAiKey: { key: null },
  chatSetup: {
    model: '',
    topic: '',
    level: '',
    role: '',
  },
  conversation: [],
  setDisableMicro: (disableMicro: boolean) => set({ disableMicro }),
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
  setConversation: ({ messages, textContent, id, url }: setConversation) =>
    set({
      conversation: [...messages, { id, role: 'assistant', content: textContent, url }],
    }),
  initConversation: (message: ExtendCoreMessage[]) =>
    set((prevState) => ({
      conversation: [...message],
    })),
}))
