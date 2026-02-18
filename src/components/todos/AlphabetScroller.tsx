import { useCallback } from 'react'
import { cn } from '@/lib/utils'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface AlphabetScrollerProps {
  availableLetters: Set<string>
  onLetterTap: (letter: string) => void
}

export function AlphabetScroller({ availableLetters, onLetterTap }: AlphabetScrollerProps) {
  const handleTap = useCallback(
    (letter: string) => {
      if (availableLetters.has(letter)) {
        onLetterTap(letter)
      }
    },
    [availableLetters, onLetterTap]
  )

  if (availableLetters.size < 5) return null

  return (
    <div className="fixed right-1 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center">
      {LETTERS.map((letter) => {
        const isAvailable = availableLetters.has(letter)
        return (
          <button
            key={letter}
            onClick={() => handleTap(letter)}
            className={cn(
              'flex h-5 w-6 items-center justify-center text-[10px] font-medium transition-colors',
              isAvailable
                ? 'text-primary hover:text-primary/70'
                : 'text-muted-foreground/30'
            )}
            disabled={!isAvailable}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}
