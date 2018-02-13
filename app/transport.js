import EventEmitter from 'eventemitter3'

class TransportLayer extends EventEmitter {
    fetchTimeline(id = 13258) {
        return fetch(`https://mycujoo.tv/live/timeline/${id}`)
    }
}

export default new TransportLayer()
