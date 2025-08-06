import { PrettyMessage } from './ChatWindow'

export default function ChatMessage({
    message,
    key,
}: {
    message: PrettyMessage
    key: number
}) {
    return (
        <>
            <div
                key={key}
                className="flex flex-row justify-start gap-1 text-white"
            >
                <p>
                    <b>{message.senderName}: </b>
                </p>
                <p>{message.text}</p>
            </div>
        </>
    )
}
