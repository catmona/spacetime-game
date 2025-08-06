import { useState } from 'react'
import ChatInput from './ChatInput'
import ChatPanel from './ChatPanel'
import { useMessages } from '../../hooks/useMessages'
import { useUsers } from '../../hooks/useUsers'
import { DbConnection } from '../../module_bindings'
import MsgChannel from '../../module_bindings/msg_channel_type'

export type PrettyMessage = {
    senderName: string
    text: string
    channel: MsgChannel
}

export default function ChatWindow({ conn }: { conn: DbConnection }) {
    const [newMessage, setNewMessage] = useState('')
    const messages = useMessages(conn)
    const users = useUsers(conn)

    const onMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setNewMessage('')

        // tag-based enum for some unholy reason
        conn.reducers.sendMessage(newMessage, { tag: 'Global' })
    }

    return (
        <div className="absolute bottom-1 left-0 w-[400px] h-[436px] max-h-[436px] bg-white bg-opacity-5 rounded-tr flex gap-1 justify-center flex-col p-1">
            <ChatPanel messages={messages} users={users} />
            <ChatInput
                onMessageSubmit={onMessageSubmit}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
            />
        </div>
    )
}
