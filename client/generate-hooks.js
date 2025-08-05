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
import { useEffect, useState } from 'react'
import { ${pascal} } from 'src/module_bindings'

export function ${hookName}() {
  const [${table}, set${pascal}] = useState([])

  useEffect(() => {
    const sub = ${table}.subscribeAll({
      onInsert: (_ctx, row) => setItems(prev => [...prev, row]),
      onUpdate: (_ctx, row) =>
        setItems(prev => {
          const index = prev.findIndex(i => i.${key} === row.${key})
          if (index === -1) return [...prev, row]
          const updated = [...prev]
          updated[index] = row
          return updated
        }),
      onDelete: (_ctx, row) =>
        setItems(prev => prev.filter(i => i.${key} !== row.${key})),
    })

    return () => sub.unsubscribe()
  }, [])

  return items
}
`.trimStart()

    fs.writeFileSync(path.join(outDir, `${hookName}.ts`), fileContent)
}

console.log(
    `✅ Generated hooks for tables: ${Object.keys(tableConfigs).join(', ')}`
)
