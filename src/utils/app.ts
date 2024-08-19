type props<T extends any[]> = {
  callback: (...args: T) => void
  delay: number
}
export const debounce = <T extends any[]>({ callback, delay }: props<T>) => {
  let timerId: number | null = null
  return (...args: T) => {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => callback(...args), delay) as unknown as number
  }
}
