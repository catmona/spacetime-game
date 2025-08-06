import { useEffect, useRef, useState } from 'react'
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
    const scrollRef = useRef<HTMLDivElement>(null)
    const [hasScrolledUp, setHasScrolledUp] = useState(false)
    const [oldNumMessages, setOldNumMessages] = useState(0)

    const prettyMessages: PrettyMessage[] = [...messages.values()]
        .sort((a, b) => (a.sent > b.sent ? 1 : -1))
        .map((message) => ({
            senderName:
                users.get(message.sender.toHexString())?.name ||
                message.sender.toHexString().substring(0, 8),
            text: message.text,
            channel: message.channel,
        }))

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return

            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            // If the user has scrolled up more than 20px from the bottom, consider it as "scrolled up"
            setHasScrolledUp(scrollHeight - scrollTop - clientHeight > 20)
        }

        const currentRef = scrollRef.current
        currentRef?.addEventListener('scroll', handleScroll)

        return () => {
            currentRef?.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        if (scrollRef.current && !hasScrolledUp) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            setOldNumMessages(prettyMessages.length)
        }
    }, [prettyMessages])

    return (
        <>
            <div className="w-full h-full overflow-y-auto pl-1" ref={scrollRef}>
                {prettyMessages.length < 1 && (
                    <p className="text-white">No messages</p>
                )}
                <div>
                    {prettyMessages.map((message, key) => (
                        <ChatMessage message={message} key={key} />
                    ))}
                </div>
                {hasScrolledUp && prettyMessages.length > oldNumMessages ? (
                    <div className="absolute w-full bottom-8 text-right">
                        <b className="text-red-200 pr-3 text-xl">↓</b>
                        <div className="h-0.5 bg-red-200 z-10"></div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}
