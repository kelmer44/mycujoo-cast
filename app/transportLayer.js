export default class TransportLayer {
    fetchTimeline(id = 13258) {
        return fetch(`https://api.mycujoo.tv/events/${id}/timeline`)
    }
    fetchMatchInfo(id = 13258) {
        return fetch(`https://api.mycujoo.tv/events/${id}`)
    }
}
