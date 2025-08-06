import { Message, User } from '../../module_bindings'
import ChatMessage from './ChatMessage'
import { PrettyMessage } from './ChatWindow'

export default function ChatPanel({
    messages,
    users,
}: {
    messages: Map<string, Message>
    users: Map<string, User>
}) {
    const prettyMessages: PrettyMessage[] = [...messages.values()]
        .sort((a, b) => (a.sent > b.sent ? 1 : -1))
        .map((message) => ({
            senderName:
                users.get(message.sender.toHexString())?.name ||
                message.sender.toHexString().substring(0, 8),
            text: message.text,
        }))
    return (
        <>
            <div className="w-full h-full overflow-y-auto pl-1">
                {prettyMessages.length < 1 && <p>No messages</p>}
                <div>
                    {prettyMessages.map((message, key) => (
                        <ChatMessage message={message} key={key} />
                    ))}
                </div>
            </div>
        </>
    )
}
