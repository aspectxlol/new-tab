import { useState, useEffect, useRef } from "react"
import { CheckSquare, Plus, Trash2, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STORAGE_KEY = "dashboard-todos"

type Todo = { id: number; text: string; done: boolean }

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  const save = (updated: Todo[]) => {
    setTodos(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const add = () => {
    const text = input.trim()
    if (!text) return
    save([...todos, { id: Date.now(), text, done: false }])
    setInput("")
    inputRef.current?.focus()
  }

  const toggle = (id: number) =>
    save(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const remove = (id: number) => save(todos.filter((t) => t.id !== id))

  const remaining = todos.filter((t) => !t.done).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-emerald-400" />
          To-Do
        </CardTitle>
        <span className="ml-auto text-xs text-muted-foreground">
          {remaining > 0 ? `${remaining} remaining` : todos.length > 0 ? "All done!" : ""}
        </span>
      </CardHeader>
      <CardContent className="px-4 pb-4">
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
          {todos.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">No tasks yet</p>
          ) : (
            todos.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 group rounded-md px-1 py-0.5 hover:bg-accent/30 transition-colors">
                <button
                  onClick={() => toggle(t.id)}
                  className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    t.done ? "bg-emerald-500 border-emerald-500" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {t.done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </button>
                <span
                  className={`flex-1 text-sm select-none ${
                    t.done ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {t.text}
                </span>
                <button
                  onClick={() => remove(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
