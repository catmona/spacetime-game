// Auto-generated hook for message
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useEffect, useState } from 'react'
import { DbConnection, EventContext, Message } from '../module_bindings';

export function useMessages(conn: DbConnection | null): Map<string, Message> {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());

  useEffect(() => {
    if (!conn) return;
    
    // onInsert
    const onInsert = (_ctx: EventContext, message: Message) => {
      setMessages(prev => new Map(prev.set(message.id.toHexString(), message)));
    };
    conn.db.message.onInsert(onInsert);

    // onDelete
    const onDelete = (_ctx: EventContext, message: Message) => {
      setMessages(prev => {
        prev.delete(message.id.toHexString());
        return new Map(prev);
      });
    };
    conn.db.message.onDelete(onDelete);

    // onUpdate
    const onUpdate = (_ctx: EventContext, oldMessage: Message, newMessage: Message) => {
      setMessages(prev => {
        prev.delete(oldMessage.id.toHexString());
        return new Map(prev.set(newMessage.identity.toHexString(), newMessage));
      });
    };
    conn.db.message.onUpdate(onUpdate);
    
    return () => {
      conn.db.message.removeOnInsert(onInsert);
      conn.db.message.removeOnDelete(onDelete);
      conn.db.message.removeOnUpdate(onUpdate);
    };
  }, [conn]);
  
  return messages;
}
