import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

function chatKey(userId, workerId) {
  return `chat-${userId}-${workerId}`
}

export default function ChatBox({ worker, onClose }) {
  const { auth } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    if (!auth) return
    const key = chatKey(auth.id, worker.id)
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "[]")
      setMessages(stored)
    } catch (e) {
      setMessages([])
    }
  }, [auth, worker])

  const push = (text, sender) => {
    if (!auth) return alert('Sign in to chat')
    const key = chatKey(auth.id, worker.id)
    const next = [...messages, { id: Date.now(), text, sender, createdAt: new Date().toISOString() }]
    setMessages(next)
    localStorage.setItem(key, JSON.stringify(next))
    setInput("")
  }

  return (
    <div className="w-80 bg-card border border-border rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div>
          <div className="font-semibold">Chat with {worker.name}</div>
          <div className="text-xs text-muted-foreground">Negotiate price or confirm details</div>
        </div>
        <button onClick={onClose} className="text-sm text-muted-foreground">Close</button>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-2">
        {messages.length === 0 && <div className="text-xs text-muted-foreground">No messages yet.</div>}
        {messages.map((m) => (
          <div key={m.id} className={`text-sm ${m.sender === 'me' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-3 py-1 rounded ${m.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
              {m.text}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border flex items-center gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-3 py-2 border border-border rounded-lg" placeholder="Type your message" />
        <button onClick={() => push(input, 'me')} disabled={!input.trim()} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg">Send</button>
      </div>
    </div>
  )
}
