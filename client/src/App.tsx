import { useEffect, useState } from 'react'
import './index.css'
import { DbConnection, type ErrorContext } from './module_bindings'
import { Identity } from '@clockworklabs/spacetimedb-sdk'
import ChatWindow from './_components/chat/ChatWindow'

function App() {
    const [systemMessage, setSystemMessage] = useState('')

    const [connected, setConnected] = useState<boolean>(false)
    const [identity, setIdentity] = useState<Identity | null>(null)
    const [conn, setConn] = useState<DbConnection | null>(null)

    useEffect(() => {
        const subscribeToQueries = (conn: DbConnection, queries: string[]) => {
            conn?.subscriptionBuilder()
                .onApplied(() => {
                    console.log('SDK client cache initialized.')
                })
                .subscribe(queries)
        }

        const onConnect = (
            conn: DbConnection,
            identity: Identity,
            token: string
        ) => {
            setIdentity(identity)
            setConnected(true)
            localStorage.setItem('auth_token', token)
            console.log(
                'Connected to SpacetimeDB with identity:',
                identity.toHexString()
            )
            conn.reducers.onSendMessage(() => {
                console.log('Message sent.')
            })

            subscribeToQueries(conn, [
                'SELECT * FROM message',
                'SELECT * FROM user',
            ])
        }

        const onDisconnect = () => {
            console.log('Disconnected from SpacetimeDB')
            setConnected(false)
        }

        const onConnectError = (_ctx: ErrorContext, err: Error) => {
            console.log('Error connecting to SpacetimeDB:', err)
        }

        setConn(
            DbConnection.builder()
                .withUri('ws://localhost:3000')
                .withModuleName('chat-server')
                .withToken(localStorage.getItem('auth_token') || '')
                .onConnect(onConnect)
                .onDisconnect(onDisconnect)
                .onConnectError(onConnectError)
                .build()
        )
    }, [])

    useEffect(() => {
        if (!conn) return
        conn.db.user.onInsert((_ctx, user) => {
            if (user.online) {
                const name =
                    user.name || user.identity.toHexString().substring(0, 8)
                setSystemMessage((prev) => prev + `\n${name} has connected.`)
            }
        })
        conn.db.user.onUpdate((_ctx, oldUser, newUser) => {
            const name =
                newUser.name || newUser.identity.toHexString().substring(0, 8)
            if (oldUser.online === false && newUser.online === true) {
                setSystemMessage((prev) => prev + `\n${name} has connected.`)
            } else if (oldUser.online === true && newUser.online === false) {
                setSystemMessage((prev) => prev + `\n${name} has disconnected.`)
            }
        })
    }, [conn])

    if (!conn || !connected || !identity) {
        return (
            <div className="App">
                <h1 className="text-white">Connecting...</h1>
            </div>
        )
    }

    return (
        <div className="App bg-black h-svh w-svh">
            <div className="system" style={{ whiteSpace: 'pre-wrap' }}>
                <h1>System</h1>
                <div>
                    <p>{systemMessage}</p>
                </div>
            </div>

            <ChatWindow conn={conn} identity={identity} />
        </div>
    )
}

export default App
