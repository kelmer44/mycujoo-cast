import io from 'socket.io-client'

export default io('https://realtime.mycujoo.tv/live', { transports: [ 'websocket' ]})
