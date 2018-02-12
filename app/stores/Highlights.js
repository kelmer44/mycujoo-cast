import axios from 'axios'
import socket from '../socket'

export default class HighlightsStore {
    id = 0

    constructor({ id }) {
        this.id = id
        socket.socket.on('HIGHLIGHTS_FETCH', this.fetchHighlights)
        this.fetchHighlights()
    }

    async fetchHighlights() {
        const query = [ 'a=get_highlight_live', `id=${this.id}` ]
        const { data } = await axios.get(`https://mycujoo.tv/live/ajax?${query.join('&')}`)

        // now u have highlights data
    }
}
