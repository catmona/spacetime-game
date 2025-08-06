export default function ChatInput({
    onMessageSubmit,
    newMessage,
    setNewMessage,
}: {
    onMessageSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    newMessage: string
    setNewMessage: (message: string) => void
}) {
    return (
        <>
            <div className="w-full h-8 bg-blue-200 px-1">
                <form onSubmit={onMessageSubmit} className="w-full h-full flex">
                    <input
                        type="text"
                        className="w-full outline-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    ></input>
                    <button
                        type="submit"
                        className="h-1 w-1 cursor-pointer"
                    ></button>
                </form>
            </div>
        </>
    )
}
