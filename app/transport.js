import EventEmitter from 'eventemitter3'

export default class TransportLayer extends EventEmitter {
    constructor() {
        // connect to ws
        // this.socket.on('update', () => this.emit('receiveHighlightsUpdate'))
    }

    async fetchTimeline(id) {
        const response = await fetch(`https://mycujoo.tv/live/timeline/${id}`)
        return response.json()
    }
}
