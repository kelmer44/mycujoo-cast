import { observable, computed, action } from 'mobx'

import checkUrlInLogo from '../lib/checkUrlInLogo'

export default class PlayerStore {
    @observable score = {}
    @observable timer = {}
    @observable team_away = {}
    @observable team_home = {}
    @observable eventId = false
    @observable tvId = false
    @observable competitionId = false
    @observable competition = false
    @observable scoreboardSponsor = false
    @observable playerSponsors = false

    check = null
    CastPlayer = null

    @observable currentTimeInPlayer = 0

    constructor({ transportLayer }) {
        this.transportLayer = transportLayer
    }

    initialise() {
        if (!this.CastPlayer) {
            const playerDiv = document.getElementById('player')
            this.CastPlayer = new sampleplayer.CastPlayer(playerDiv, metaData => {
                this.setMetaDataAndCustomData(metaData)
            })
            this.CastPlayer.start()
        }
        if (!this.check) {
            this.check = requestAnimationFrame(() => this.getTimeFromPlayer())
        }
    }

    @computed
    get realTimer() {
        const { timer } = this
        if (timer.stopped) {
            return timer.time
        } else {
            const delta = this.currentTimeInPlayer - timer.at
            return timer.time + delta
        }
    }

    async fetchMatchInfo(eventId) {
        const response = await this.transportLayer.fetchMatchInfo(eventId)
        const json = await response.json()
        this.updateFromJson(json)
    }

    async fetchPlayerSponsors(tvId, competitionId) {
        const response = await this.transportLayer.fetchPlayerSponsors(tvId, competitionId)
        const json = await response.json()
        this.playerSponsors = json[0].campaign_spots
            .concat()
            .filter(spot => spot.slug.startsWith('tv-header'))
    }

    @action.bound
    setMetaDataAndCustomData({ metaData, customData }) {
        if (customData && customData.mAdsMetaData) {
            if (customData.mAdsMetaData.channelId) {
                this.tvId = parseInt(customData.mAdsMetaData.channelId, 10)
            }
            if (customData.mAdsMetaData.competitionId) {
                this.competitionId = parseInt(customData.mAdsMetaData.competitionId, 10)
            }
            if (customData.mAdsMetaData.eventId) {
                this.eventId = parseInt(customData.mAdsMetaData.eventId, 10)
            }
        }

        if (this.eventID) {
            this.fetchMatchInfo(this.eventId)
        }

        if (this.tvId && this.competitionId) {
            this.fetchPlayerSponsors(this.tvId, this.competitionId)
        }
    }

    @action.bound
    getTimeFromPlayer() {
        setTimeout(() => {
            const mediaElement = this.CastPlayer.getMediaElement()
            if (mediaElement && mediaElement.currentTime) {
                this.currentTimeInPlayer = mediaElement.currentTime
            }
            this.check = requestAnimationFrame(() => this.getTimeFromPlayer())
        }, 1000)
    }

    @action.bound
    updateFromJson(json) {
        this.team_away = {
            ...json.match_data.team_away,
            logo: checkUrlInLogo(json.match_data.team_away.logo),
        }

        this.team_home = {
            ...json.match_data.team_home,
            logo: checkUrlInLogo(json.match_data.team_home.logo),
        }

        this.competition = json.description

        if(json.sponsor) {
            this.sponsor = json.sponsor
        }
    }

    @action.bound
    reset() {
        this.timer = {
            time: 0,
            at: 0,
            enabled: false,
            stopped: true,
        }
        this.score = {
            enabled: false,
            data: [ 0, 0 ],
        }
    }

    @action.bound
    timerShown(item, state) {
        this.timer.enabled = true
    }

    @action.bound
    timerHidden() {
        this.timer.enabled = false
    }

    @action.bound
    timerStarted(item) {
        this.timer.time = item.data.elapsed
        this.timer.at = item.offset
        this.timer.stopped = false
    }

    @action.bound
    timerStopped(item) {
        this.timer.time = item.data.elapsed
        this.timer.at = item.offset
        this.timer.stopped = true
    }

    @action.bound
    timerUpdated(item) {
        this.timer.time = item.data.elapsed
        this.timer.at = item.offset
    }

    @action.bound
    scoreShown() {
        this.score.enabled = true
    }

    @action.bound
    scoreHidden() {
        this.score.enabled = false
    }

    @action.bound
    scoreIncreased(item) {
        const team = item.data.team === 'home' ? 0 : 1
        this.score.data[team] = this.score.data[team] + 1
    }

    @action.bound
    scoreDecreased(item) {
        const team = item.data.team === 'home' ? 0 : 1
        this.score.data[team] = this.score.data[team] - 1
    }

    dispose() {
        cancelAnimationFrame(this.check)
        this.check = null
    }
}
