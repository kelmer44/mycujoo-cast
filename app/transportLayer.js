export default class TransportLayer {
    fetchTimeline(id) {
        return fetch(`https://api.mycujoo.tv/events/${id}/timeline`)
    }
    fetchMatchInfo(id) {
        return fetch(`https://api.mycujoo.tv/events/${id}`)
    }
    fetchPlayerSponsors(tvId, competitionId) {
        return fetch(`https://api.mycujoo.tv/tvs/${tvId}/campaigns?eager=campaign_spots&data.competition_id_legacy=${competitionId}`)
    }
}
