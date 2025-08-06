import { useState } from 'react'
import ChatInput from './ChatInput'
import ChatPanel from './ChatPanel'
import { DbConnection } from '../../module_bindings'
import { useMessages } from '../../hooks/useMessages'
import { useUsers } from '../../hooks/useUsers'
import { Identity } from '@clockworklabs/spacetimedb-sdk'

export type PrettyMessage = {
    senderName: string
    text: string
}

export default function ChatWindow({
    conn,
    identity,
}: {
    conn: DbConnection
    identity: Identity
}) {
    const [newMessage, setNewMessage] = useState('')
    const messages = useMessages(conn)
    const users = useUsers(conn)

    const onMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setNewMessage('')
        conn.reducers.sendMessage(newMessage)
    }

    const name =
        users.get(identity?.toHexString())?.name ||
        identity?.toHexString().substring(0, 8) ||
        'unknown'

    return (
        <div className="absolute bottom-0 left-0 w-[35%] h-1/2 max-h-1/2 bg-black bg-opacity-50 rounded-tr flex gap-1 justify-center flex-col p-1 overflow-hidden">
            <ChatPanel messages={messages} users={users} />
            <ChatInput
                onMessageSubmit={onMessageSubmit}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
            />
        </div>
    )
}
