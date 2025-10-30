import { get, set } from 'idb-keyval'
import { nanoid } from 'nanoid/non-secure'

export type Note = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  deleted?: boolean
}

const KEY = 'notes:v1'

async function loadAll(): Promise<Note[]> {
  try {
    const idb = (await get<Note[]>(KEY)) || []
    if (idb.length > 0) return idb
    const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null
    return raw ? JSON.parse(raw) as Note[] : []
  } catch {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null
      return raw ? JSON.parse(raw) as Note[] : []
    } catch {
      return []
    }
  }
}

async function saveAll(notes: Note[]): Promise<void> {
  try {
    await set(KEY, notes)
  } catch {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(KEY, JSON.stringify(notes)) } catch {}
    }
  }
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(KEY, JSON.stringify(notes)) } catch {}
  }
}

export function useNotes() {
  const notes = useState<Note[]>('notes', () => [])

  let initialized = false
  async function ensureInit() {
    if (!initialized && typeof window !== 'undefined') {
      notes.value = await loadAll()
      initialized = true
    }
  }
  if (typeof window !== 'undefined') ensureInit()

  function create(title: string, content: string): Promise<void> {
    if (!initialized) return ensureInit().then(() => create(title, content))
    const now = new Date().toISOString()
    const n: Note = { id: nanoid(10), title, content, createdAt: now, updatedAt: now }
    notes.value = [n, ...notes.value]
    return saveAll(notes.value)
  }

  function update(id: string, patch: Partial<Pick<Note, 'title'|'content'>>): Promise<void> {
    if (!initialized) return ensureInit().then(() => update(id, patch))
    notes.value = notes.value.map(n => n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)
    return saveAll(notes.value)
  }

  function remove(id: string): Promise<void> {
    if (!initialized) return ensureInit().then(() => remove(id))
    notes.value = notes.value.filter(n => n.id !== id)
    return saveAll(notes.value)
  }

  function clearAll(): Promise<void> {
    if (!initialized) return ensureInit().then(() => clearAll())
    notes.value = []
    return saveAll(notes.value)
  }

  const ready = ensureInit()
  return { notes, create, update, remove, clearAll, ready }
}
