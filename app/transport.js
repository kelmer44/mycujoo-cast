import EventEmitter from 'eventemitter3'

class TransportLayer extends EventEmitter {
    async fetchTimeline(id = 13258) {
        const response = await fetch(`https://mycujoo.tv/live/timeline/${id}`)
        return response.json()
    }
}

export default new TransportLayer()
