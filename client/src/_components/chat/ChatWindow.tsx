import { useState } from 'react'
import ChatInput from './ChatInput'
import ChatPanel from './ChatPanel'
import { useMessages } from '../../hooks/useMessages'
import { useUsers } from '../../hooks/useUsers'
import { Identity } from '@clockworklabs/spacetimedb-sdk'
import { DbConnection } from '../../module_bindings'
import MsgChannel from '../../module_bindings/msg_channel_type'

export type PrettyMessage = {
    senderName: string
    text: string
    channel: MsgChannel
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

        // tag-based enum for some unholy reason
        conn.reducers.sendMessage(newMessage, { tag: 'Global' })
    }

    const name =
        users.get(identity?.toHexString())?.name ||
        identity?.toHexString().substring(0, 8) ||
        'unknown'

    return (
        <div className="absolute bottom-0 left-0 w-[35%] h-1/2 max-h-1/2 bg-white bg-opacity-5 rounded-tr flex gap-1 justify-center flex-col p-1 overflow-hidden">
            <ChatPanel messages={messages} users={users} />
            <ChatInput
                onMessageSubmit={onMessageSubmit}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
            />
        </div>
    )
}
