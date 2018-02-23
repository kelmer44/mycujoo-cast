export default class TransportLayer {
    fetchTimeline(id) {
        return fetch(`https://api.mycujoo.tv/events/${id}/timeline`)
    }
    fetchEventInfo(id) {
        return fetch(`https://api.mycujoo.tv/events/${id}?eager=competition`)
    }
    fetchHighlightInfo(id) {
        return fetch(`https://api.mycujoo.tv/highlights/${id}`)
    }
    fetchPlayerSponsors(tvId, competitionId) {
        return fetch(`https://api.mycujoo.tv/tvs/${tvId}/campaigns?eager=campaign_spots&data.competition_id_legacy=${competitionId}`)
    }
}
