import fs from 'fs'
import path from 'path'

const tableConfigs = {
    message: { key: 'id' },
    user: { key: 'identity' },
}

const outDir = './src/hooks/'
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

for (const [table, { key }] of Object.entries(tableConfigs)) {
    const pascal = table[0].toUpperCase() + table.slice(1)
    const hookName = `use${pascal}`
    const fileContent = `
// Auto-generated hook for ${table}
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useEffect, useState } from 'react'
import { ${pascal} } from 'src/module_bindings'

export function ${hookName}() {
  const [${table}s, set${pascal}] = useState([])

  useEffect(() => {
    const sub = ${table}s.subscribeAll({
      onInsert: (_ctx, row) => set${pascal}(prev => [...prev, row]),
      onUpdate: (_ctx, row) =>
        set${pascal}(prev => {
          const index = prev.findIndex(i => i.${key} === row.${key})
          if (index === -1) return [...prev, row]
          const updated = [...prev]
          updated[index] = row
          return updated
        }),
      onDelete: (_ctx, row) =>
        set${pascal}(prev => prev.filter(i => i.${key} !== row.${key})),
    })

    return () => sub.unsubscribe()
  }, [])

  return ${table}s
}
`.trimStart()

    fs.writeFileSync(path.join(outDir, `${hookName}.ts`), fileContent)
}

console.log(
    `✅ Generated hooks for tables: ${Object.keys(tableConfigs).join(', ')}`
)
