// Auto-generated hook for user
import { useEffect, useState } from 'react'
import { User } from 'src/module_bindings'

export function useUser() {
  const [user, setUser] = useState([])

  useEffect(() => {
    const sub = user.subscribeAll({
      onInsert: (_ctx, row) => setItems(prev => [...prev, row]),
      onUpdate: (_ctx, row) =>
        setItems(prev => {
          const index = prev.findIndex(i => i.identity === row.identity)
          if (index === -1) return [...prev, row]
          const updated = [...prev]
          updated[index] = row
          return updated
        }),
      onDelete: (_ctx, row) =>
        setItems(prev => prev.filter(i => i.identity !== row.identity)),
    })

    return () => sub.unsubscribe()
  }, [])

  return items
}
