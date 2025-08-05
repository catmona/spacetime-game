// Auto-generated hook for user
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useEffect, useState } from 'react'
import { User } from 'src/module_bindings'

export function useUser() {
  const [users, setUser] = useState([])

  useEffect(() => {
    const sub = users.subscribeAll({
      onInsert: (_ctx, row) => setUser(prev => [...prev, row]),
      onUpdate: (_ctx, row) =>
        setUser(prev => {
          const index = prev.findIndex(i => i.identity === row.identity)
          if (index === -1) return [...prev, row]
          const updated = [...prev]
          updated[index] = row
          return updated
        }),
      onDelete: (_ctx, row) =>
        setUser(prev => prev.filter(i => i.identity !== row.identity)),
    })

    return () => sub.unsubscribe()
  }, [])

  return users
}
