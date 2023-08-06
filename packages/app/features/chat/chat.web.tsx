import { ChannelFilters, ChannelSort, User } from 'stream-chat'
import { useEffect, useState } from 'react'

import {
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelPreviewProps,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  useMessageContext,
  Window,
} from 'stream-chat-react'
import { StreamChat, TokenOrProvider } from 'stream-chat'

export type UseClientOptions = {
  apiKey: string
  user: User
  tokenOrProvider: TokenOrProvider
}

const useClient = ({
  apiKey,
  user,
  tokenOrProvider,
}: UseClientOptions): StreamChat | undefined => {
  const [chatClient, setChatClient] = useState<StreamChat>()

  useEffect(() => {
    const client = new StreamChat(apiKey)
    // prevents application from setting stale client (user changed, for example)
    let didUserConnectInterrupt = false

    const connectionPromise = client
      .connectUser(user, tokenOrProvider)
      .then(() => {
        if (!didUserConnectInterrupt) {
          setChatClient(client)
        }
      })

    return () => {
      didUserConnectInterrupt = true
      setChatClient(undefined)
      // wait for connection to finish before initiating closing sequence
      connectionPromise
        .then(() => client.disconnectUser())
        .then(() => {
          console.log('connection closed')
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should re-run only if user.id changes
  }, [apiKey, user.id, tokenOrProvider])

  return chatClient
}

import 'stream-chat-react/dist/css/v2/index.css'

const userId = 'billowing-butterfly-4'
const userName = 'billowing'

const user = {
  id: 'johnmccants2',
  name: '',
  image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
}

const apiKey = 'pbjak6tvw7x4'
const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmlsbG93aW5nLWJ1dHRlcmZseS00IiwiZXhwIjoxNjkxMjc3Njc1fQ.Y-fjcYgnlVttgyozlPs9Wk0LNvqSJ8lxHa7UQigOIc8'

const sort = { last_message_at: -1 }
// const filters = {
//   type: "messaging",
//   members: { $in: [userId] },
// };

const CustomChannelPreview = (props) => {
  const { channel, setActiveChannel } = props

  const { messages } = channel.state
  const messagePreview = messages[messages.length - 1]?.text?.slice(0, 30)

  return (
    <div
      onClick={() => setActiveChannel?.(channel)}
      style={{ margin: '12px', display: 'flex', gap: '5px' }}
    >
      <div>
        <img
          src={channel.data?.image}
          alt="channel-image"
          style={{ height: '36px' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div>{channel.data?.name || 'Unnamed Channel'}</div>
        {messagePreview && (
          <div style={{ fontSize: '14px' }}>{messagePreview}</div>
        )}
      </div>
    </div>
  )
}

const CustomMessage = () => {
  const { message } = useMessageContext()
  return (
    <div>
      <b style={{ marginRight: '4px' }}>{message.user?.name}</b> {message.text}
    </div>
  )
}

const ChatScreen = () => {
  const chatClient = useClient({
    apiKey,
    user,
    tokenOrProvider:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam9obm1jY2FudHMyIn0.TSNHolZ6V30bGfFI-ZVAT6KpHh4ZoCsqTWlT0NPQ9mI',
  })

  if (!chatClient) {
    return <LoadingIndicator />
  }

  return (
    <Chat client={chatClient} theme="str-chat__theme-light">
      <ChannelList sort={sort} Preview={CustomChannelPreview} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList Message={CustomMessage} />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  )
}

export default ChatScreen
