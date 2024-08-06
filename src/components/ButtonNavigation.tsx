'use client'

import { useAppStore } from '@/store/zustand-store'
import { Button } from './ui/button'
import Link from 'next/link'

interface Props {
  page: string
}

export default function ButtonNavigation({ page }: Props) {
  const { openAiKey, chatSetup } = useAppStore((state) => ({
    chatSetup: state.chatSetup,
    openAiKey: state.openAiKey.key,
  }))

  if (openAiKey && page === 'home') {
    return (
      <Button asChild className="p-8">
        <Link href={'/setup'} className="font-kadwa text-xl font-bold">
          Great! Time to Set Up Your Chat!
        </Link>
      </Button>
    )
  }
  if (chatSetup.model.length > 0) {
    return (
      <Button asChild className="p-8">
        <Link href={'/chat-ai'} className="font-kadwa text-xl font-bold">
          Awesome! Start Learning!
        </Link>
      </Button>
    )
  }
}
