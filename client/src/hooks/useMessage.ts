// Auto-generated hook for message
import { useEffect, useState } from 'react'
import { Message } from 'src/module_bindings'

export function useMessage() {
  const [message, setMessage] = useState([])

  useEffect(() => {
    const sub = message.subscribeAll({
      onInsert: (_ctx, row) => setItems(prev => [...prev, row]),
      onUpdate: (_ctx, row) =>
        setItems(prev => {
          const index = prev.findIndex(i => i.id === row.id)
          if (index === -1) return [...prev, row]
          const updated = [...prev]
          updated[index] = row
          return updated
        }),
      onDelete: (_ctx, row) =>
        setItems(prev => prev.filter(i => i.id !== row.id)),
    })

    return () => sub.unsubscribe()
  }, [])

  return items
}
