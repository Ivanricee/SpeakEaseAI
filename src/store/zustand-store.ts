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
interface State {
  openMenu: boolean
  openAiKey: OpenAiType
  chatSetup: chatSetup
}
interface Actions {
  setOpenAiKey: (openAI: OpenAiType) => void
  setChatSetup: (chatSetup: chatSetup) => void
  setOpenMenu: (openMenu: boolean) => void
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
}))
