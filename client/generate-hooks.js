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
    const set = `set${pascal}s`
    const plural = `${table}s`
    const hookName = `use${pascal}s`
    const fileContent = `
// Auto-generated hook for ${table}
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useEffect, useState } from 'react'
import { DbConnection, EventContext, ${pascal} } from '../module_bindings';

export function ${hookName}(conn: DbConnection | null): Map<string, ${pascal}> {
  const [${plural}, ${set}] = useState<Map<string, ${pascal}>>(new Map());

  useEffect(() => {
    if (!conn) return;
    
    // onInsert
    const onInsert = (_ctx: EventContext, ${table}: ${pascal}) => {
      ${set}(prev => new Map(prev.set(${table}.${key}.toHexString(), ${table})));
    };
    conn.db.${table}.onInsert(onInsert);

    // onDelete
    const onDelete = (_ctx: EventContext, ${table}: ${pascal}) => {
      ${set}(prev => {
        prev.delete(${table}.${key}.toHexString());
        return new Map(prev);
      });
    };
    conn.db.message.onDelete(onDelete);

    // onUpdate
    const onUpdate = (_ctx: EventContext, old${pascal}: ${pascal}, new${pascal}: ${pascal}) => {
      ${set}(prev => {
        prev.delete(old${pascal}.${key}.toHexString());
        return new Map(prev.set(new${pascal}.identity.toHexString(), new${pascal}));
      });
    };
    conn.db.${table}.onUpdate(onUpdate);
    
    return () => {
      conn.db.${table}.removeOnInsert(onInsert);
      conn.db.${table}.removeOnDelete(onDelete);
      conn.db.${table}.removeOnUpdate(onUpdate);
    };
  }, [conn]);
  
  return ${plural};
}
`.trimStart()

    fs.writeFileSync(path.join(outDir, `${hookName}.ts`), fileContent)
}

console.log(
    `✅ Generated hooks for tables: ${Object.keys(tableConfigs).join(', ')}`
)
