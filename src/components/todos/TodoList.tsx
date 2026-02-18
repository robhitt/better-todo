import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { MoreHorizontal, Share2, Pencil, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTodos, addTodo, toggleTodo, deleteTodo, optimisticToggle, clearTodos } from '@/store/slices/todosSlice'
import { renameList, deleteList } from '@/store/slices/listsSlice'
import { useSearch } from '@/hooks/useSearch'
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShareListDialog } from '@/components/lists/ShareListDialog'
import { SearchBar } from './SearchBar'
import { TodoItem } from './TodoItem'
import { AddTodoInput } from './AddTodoInput'
import { AlphabetScroller } from './AlphabetScroller'

export function TodoList() {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: todos, loading } = useAppSelector((state) => state.todos)
  const lists = useAppSelector((state) => state.lists.items)

  const currentList = lists.find((l) => l.id === listId)

  const [showCelebration, setShowCelebration] = useState(false)
  const prevActiveCount = useRef<number | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameName, setRenameName] = useState('')
  const [showShare, setShowShare] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useRealtimeSubscription(listId)

  // Remember last opened list
  useEffect(() => {
    if (listId) {
      localStorage.setItem('lastListId', listId)
    }
  }, [listId])

  useEffect(() => {
    if (listId) {
      dispatch(fetchTodos(listId))
    }
    return () => {
      dispatch(clearTodos())
    }
  }, [dispatch, listId])

  const { query, setQuery, results } = useSearch(todos)

  const { active, completed } = useMemo(() => {
    const sorted = [...results].sort((a, b) => a.text.localeCompare(b.text))
    return {
      active: sorted.filter((t) => !t.is_completed),
      completed: sorted.filter((t) => t.is_completed),
    }
  }, [results])

  // Available letters for alphabet scroller
  const availableLetters = useMemo(() => {
    const letters = new Set<string>()
    active.forEach((t) => {
      const first = t.text.charAt(0).toUpperCase()
      if (/[A-Z]/.test(first)) letters.add(first)
    })
    return letters
  }, [active])

  const handleLetterTap = useCallback((letter: string) => {
    const el = document.getElementById(`letter-${letter}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Celebrate when all items are completed
  useEffect(() => {
    if (prevActiveCount.current !== null && prevActiveCount.current > 0 && active.length === 0 && completed.length > 0) {
      setShowCelebration(true)
      const duration = 1000
      const end = Date.now() + duration
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
      setTimeout(() => setShowCelebration(false), 3000)
    }
    prevActiveCount.current = active.length
  }, [active.length, completed.length])

  const handleAdd = (text: string) => {
    if (listId) {
      dispatch(addTodo({ listId, text }))
    }
  }

  const handleToggle = (id: string, isCompleted: boolean) => {
    dispatch(optimisticToggle(id))
    dispatch(toggleTodo({ id, isCompleted }))
  }

  const handleDelete = (id: string) => {
    dispatch(deleteTodo(id))
    toast('Item deleted')
  }

  const handleRename = async () => {
    const trimmed = renameName.trim()
    if (!trimmed || !listId) return
    await dispatch(renameList({ id: listId, name: trimmed }))
    setIsRenaming(false)
    toast('List renamed')
  }

  const handleDeleteList = async () => {
    if (!listId || !confirm('Delete this list and all its items?')) return
    await dispatch(deleteList(listId))
    toast('List deleted')
    navigate('/')
  }

  if (!listId) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-muted-foreground">
        Select a list or create a new one
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mb-4 h-9 animate-pulse rounded-md bg-muted" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  // Group active items by first letter for alphabet scroller targets
  let currentLetter = ''

  return (
    <div className="relative mx-auto flex h-full max-w-2xl flex-col p-4">
      <div className="mb-4 flex items-center gap-2">
        {isRenaming ? (
          <form onSubmit={(e) => { e.preventDefault(); handleRename() }} className="flex flex-1 gap-2">
            <Input
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              autoFocus
              className="text-2xl font-bold"
            />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsRenaming(false)}>Cancel</Button>
          </form>
        ) : (
          <>
            <h1 className="flex-1 text-2xl font-bold">{currentList?.name ?? 'List'}</h1>
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {showMenu && (
                <div className="absolute right-0 z-10 mt-1 w-48 rounded-md border bg-popover py-1 shadow-md">
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent min-h-[44px]"
                    onClick={() => { setShowShare(true); setShowMenu(false) }}
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent min-h-[44px]"
                    onClick={() => { setRenameName(currentList?.name ?? ''); setIsRenaming(true); setShowMenu(false) }}
                  >
                    <Pencil className="h-4 w-4" /> Rename
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-accent min-h-[44px]"
                    onClick={() => { handleDeleteList(); setShowMenu(false) }}
                  >
                    <Trash2 className="h-4 w-4" /> Delete List
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {listId && <ShareListDialog listId={listId} isOpen={showShare} onClose={() => setShowShare(false)} />}

      <SearchBar value={query} onChange={setQuery} />

      <div className="mt-4 flex-1 overflow-auto pr-6" ref={scrollContainerRef}>
        {active.length > 0 && (
          <div className="mb-4">
            {active.map((todo) => {
              const firstChar = todo.text.charAt(0).toUpperCase()
              const showAnchor = /[A-Z]/.test(firstChar) && firstChar !== currentLetter
              if (showAnchor) currentLetter = firstChar

              return (
                <div key={todo.id}>
                  {showAnchor && <div id={`letter-${firstChar}`} className="scroll-mt-2" />}
                  <TodoItem
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                </div>
              )
            })}
          </div>
        )}

        {completed.length > 0 && (
          <div>
            {active.length > 0 && (
              <div className="mb-2 border-t pt-2 text-xs font-medium text-muted-foreground">
                Completed ({completed.length})
              </div>
            )}
            {completed.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {showCelebration && active.length === 0 && completed.length > 0 && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-center">
            <p className="text-lg font-semibold text-green-800">All done!</p>
            <p className="text-sm text-green-600">Every item on this list is complete</p>
          </div>
        )}

        {active.length === 0 && completed.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            {query ? 'No items match your search' : 'No items yet. Add one below!'}
          </div>
        )}
      </div>

      {!query && (
        <div className="border-t pt-4">
          <AddTodoInput onAdd={handleAdd} />
        </div>
      )}

      {!query && <AlphabetScroller availableLetters={availableLetters} onLetterTap={handleLetterTap} />}
    </div>
  )
}
