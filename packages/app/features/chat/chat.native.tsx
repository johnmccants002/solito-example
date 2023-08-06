import { useEffect, useState } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Channel as ChannelType, StreamChat } from 'stream-chat'
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  MessageType,
  OverlayProvider,
  Thread,
} from 'stream-chat-expo'

const client = StreamChat.getInstance('api_key')

export default function ChatScreen() {
  const [channel, setChannel] = useState<ChannelType>()
  const [clientReady, setClientReady] = useState(false)
  const [thread, setThread] = useState<MessageType | null>()

  const user = {
    id: 'johnmccants2',
    name: '',
    image: `https://getstream.io/random_png/?id=johnmccants2&name=""`,
  }

  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmlsbG93aW5nLWJ1dHRlcmZseS00IiwiZXhwIjoxNjkxMjc3Njc1fQ.Y-fjcYgnlVttgyozlPs9Wk0LNvqSJ8lxHa7UQigOIc8'

  useEffect(() => {
    const setupClient = async () => {
      try {
        await client.connectUser(user, userToken)
        setClientReady(true)
      } catch (e) {
        console.log(e)
      }
    }

    setupClient()
  }, [])
  return (
    <OverlayProvider topInset={60}>
      <TouchableOpacity
        onPress={() => {
          console.log('back pressed')
        }}
        disabled={!channel}
      >
        <View style={{ height: 60, paddingLeft: 16, paddingTop: 40 }}>
          {channel && <Text>Back</Text>}
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Chat client={client}>
          {channel ? (
            <Channel
              channel={channel}
              keyboardVerticalOffset={60}
              thread={thread}
              threadList={!!thread}
            >
              {thread ? (
                <Thread />
              ) : (
                <>
                  <MessageList onThreadSelect={setThread} />
                  <MessageInput />
                </>
              )}
            </Channel>
          ) : (
            <ChannelList onSelect={setChannel} />
          )}
        </Chat>
      </View>
    </OverlayProvider>
  )
}
