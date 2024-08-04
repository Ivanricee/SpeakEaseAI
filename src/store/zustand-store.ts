import { create } from 'zustand'
import { produce } from 'immer'
import { ButtonProps } from '@/components/ui/button'

type OpenAiType = {
  key: string | null
  model: string
}
interface State {
  openAiKey: OpenAiType
}
interface Actions {
  setOpenAiKey: (openAI: OpenAiType) => void
}

export const useAppStore = create<State & Actions>((set) => ({
  openAiKey: { key: null, model: '' },
  setOpenAiKey: (openAI: OpenAiType) =>
    set((prevState) => ({
      openAiKey: { ...prevState.openAiKey, ...openAI },
    })),
}))
