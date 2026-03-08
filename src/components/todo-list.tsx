import { useState, useEffect, useRef, useCallback } from "react"
import { CheckSquare, Plus, Trash2, Check, RefreshCw, LogIn, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Task = {
  id: string
  title: string
  status: "needsAction" | "completed"
}

const TASKS_API = "https://tasks.googleapis.com/tasks/v1"

async function getToken(interactive: boolean): Promise<{ token: string | null; error: string | null }> {
  if (typeof chrome === "undefined" || !chrome.identity) {
    return { token: null, error: "chrome.identity not available" }
  }

  // Try getAuthToken first
  const result = await new Promise<{ token: string | null; error: string | null }>((resolve) => {
    chrome.identity.getAuthToken({ interactive }, (tokenResult) => {
      const err = chrome.runtime.lastError
      if (err || !tokenResult) {
        resolve({ token: null, error: err?.message ?? "No token returned" })
        return
      }
      const t = typeof tokenResult === "string" ? tokenResult : tokenResult.token
      resolve({ token: t ?? null, error: t ? null : "Empty token" })
    })
  })

  return result
}

async function api(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`${TASKS_API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
  })
  if (!res.ok) throw new Error(`Tasks API ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

async function getDefaultTaskListId(token: string): Promise<string> {
  const data = await api("/users/@me/lists", token)
  return data.items?.[0]?.id ?? "@default"
}

export function TodoList() {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [input, setInput] = useState("")
  const [syncing, setSyncing] = useState(false)
  const [authed, setAuthed] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [listId, setListId] = useState<string | null>(null)
  const tokenRef = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchTasks = useCallback(async (interactive = false) => {
    setAuthError(null)
    const { token, error } = await getToken(interactive)
    if (!token) {
      setAuthed(false)
      setTasks([])
      if (interactive && error) setAuthError(error)
      return
    }
    tokenRef.current = token
    setAuthed(true)
    setSyncing(true)
    try {
      const lid = await getDefaultTaskListId(token)
      setListId(lid)
      const data = await api(`/lists/${lid}/tasks?maxResults=100&showCompleted=true&showHidden=true`, token)
      const items: Task[] = (data.items ?? []).map((t: any) => ({
        id: t.id,
        title: t.title,
        status: t.status,
      }))
      setTasks(items)
    } catch {
      setTasks([])
    } finally {
      setSyncing(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const add = async () => {
    const text = input.trim()
    if (!text || !tokenRef.current || !listId) return
    setInput("")
    inputRef.current?.focus()
    try {
      const created = await api(`/lists/${listId}/tasks`, tokenRef.current, {
        method: "POST",
        body: JSON.stringify({ title: text, status: "needsAction" }),
      })
      setTasks((prev) => prev ? [{ id: created.id, title: created.title, status: created.status }, ...prev] : prev)
    } catch { /* silently fail */ }
  }

  const toggle = async (task: Task) => {
    const newStatus = task.status === "completed" ? "needsAction" : "completed"
    setTasks((prev) => prev ? prev.map((t) => t.id === task.id ? { ...t, status: newStatus } : t) : prev)
    if (!tokenRef.current || !listId) return
    try {
      await api(`/lists/${listId}/tasks/${task.id}`, tokenRef.current, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
    } catch { /* revert on error would be nice, but keep simple */ }
  }

  const remove = async (task: Task) => {
    setTasks((prev) => prev ? prev.filter((t) => t.id !== task.id) : prev)
    if (!tokenRef.current || !listId) return
    try {
      await api(`/lists/${listId}/tasks/${task.id}`, tokenRef.current, { method: "DELETE" })
    } catch { /* silently fail */ }
  }

  const remaining = tasks?.filter((t) => t.status === "needsAction").length ?? 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-emerald-400" />
          To-Do
        </CardTitle>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {tasks && tasks.length > 0
              ? remaining > 0 ? `${remaining} remaining` : "All done!"
              : ""}
          </span>
          <button
            onClick={() => fetchTasks(true)}
            disabled={syncing}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            title="Sync with Google Tasks"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {!authed ? (
          <>
            <button
              onClick={() => fetchTasks(true)}
              className="w-full flex items-center justify-center gap-2 text-sm py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign in with Google to sync tasks
            </button>
            {authError && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded-md bg-destructive/10 text-destructive text-xs">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex gap-2 mb-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                placeholder="Add a task and press Enter..."
                className="flex-1 text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={add}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {tasks === null ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-1 py-0.5">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-3.5 flex-1" />
                    </div>
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">No tasks yet</p>
              ) : (
                tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2.5 group rounded-md px-1 py-0.5 hover:bg-accent/30 transition-colors">
                    <button
                      onClick={() => toggle(t)}
                      className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        t.status === "completed" ? "bg-emerald-500 border-emerald-500" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {t.status === "completed" && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </button>
                    <span
                      className={`flex-1 text-sm select-none ${
                        t.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {t.title}
                    </span>
                    <button
                      onClick={() => remove(t)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
