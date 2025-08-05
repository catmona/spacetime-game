// Auto-generated hook for message
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useEffect, useState } from 'react'
import { Message } from 'src/module_bindings'

export function useMessage() {
  const [messages, setMessage] = useState([])

  useEffect(() => {
    const sub = messages.subscribeAll({
      onInsert: (_ctx, row) => setMessage(prev => [...prev, row]),
      onUpdate: (_ctx, row) =>
        setMessage(prev => {
          const index = prev.findIndex(i => i.id === row.id)
          if (index === -1) return [...prev, row]
          const updated = [...prev]
          updated[index] = row
          return updated
        }),
      onDelete: (_ctx, row) =>
        setMessage(prev => prev.filter(i => i.id !== row.id)),
    })

    return () => sub.unsubscribe()
  }, [])

  return messages
}
