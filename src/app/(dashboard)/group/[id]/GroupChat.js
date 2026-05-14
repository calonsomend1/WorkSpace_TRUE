'use client'

import { useState, useEffect, useRef } from 'react'

export default function GroupChat({ messages: initialMessages, groupId, currentUser }) {
  const [messageList, setMessageList] = useState(initialMessages || [])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const messageListRef = useRef(messageList)

  // Sincroniza la ref con el estado actual para que el polling siempre vea los últimos mensajes
  useEffect(() => {
    messageListRef.current = messageList
  }, [messageList])

  // Carga inicial: fetch completo al cargar
  useEffect(() => {
    async function loadMessages() {
      const res = await fetch(`/api/messages?groupId=${groupId}`)
      if (res.ok) {
        const data = await res.json()
        setMessageList(data)
      }
    }
    loadMessages()
  }, [groupId])

  // Scroll automático al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messageList])

  // Polling optimizado: solo consulta mensajes nuevos cada 3 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      const lastMessage = messageListRef.current[messageListRef.current.length - 1]
      const sinceParam = lastMessage ? `&since=${encodeURIComponent(lastMessage.createdAt)}` : ''
      const res = await fetch(`/api/messages?groupId=${groupId}${sinceParam}`)

      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) {
          setMessageList(prev => [...prev, ...data])
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [groupId])

  async function handleSend(e) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, groupId })
    })

    if (res.ok) {
      const data = await res.json()
      setMessageList(prev => [...prev, data])
      setContent('')
    }

    setLoading(false)
  }

  function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ height: '600px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messageList.length === 0 && (
          <p className="text-sm text-center mt-10" style={{ color: 'var(--muted)' }}>
            Todavía no hay mensajes. ¡Sé el primero en escribir!
          </p>
        )}

        {messageList.map(msg => {
          const isOwn = msg.userId === currentUser.id
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
            >
              {!isOwn && (
                <span className="text-xs mb-1 ml-1" style={{ color: 'var(--muted)' }}>
                  {msg.user.name}
                </span>
              )}
              <div
                className="max-w-xs lg:max-w-md px-4 py-3 text-sm"
                style={
                  isOwn
                    ? {
                        backgroundColor: 'var(--accent)',
                        color: '#ffffff',
                        borderRadius: '1rem 1rem 2px 1rem'
                      }
                    : {
                        backgroundColor: 'var(--card-hover)',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: '1rem 1rem 1rem 2px'
                      }
                }
              >
                {msg.content}
              </div>
              <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input de mensaje */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: 'var(--card-hover)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}