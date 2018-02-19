import { observable, computed, action } from 'mobx'

import checkUrlInLogo from '../lib/checkUrlInLogo'

export default class PlayerStore {
    @observable score = {}
    @observable timer = { offset: 0 }
    @observable team_away = {}
    @observable team_home = {}
    @observable tvId = false
    @observable competitionId = false
    @observable competitionName = false
    @observable scoreboardSponsor = false
    @observable playerSponsors = false

    eventId = false
    highlightId = false
    type = null

    check = null
    checkTimeout = null
    CastPlayer = null

    @observable currentTimeInPlayer = 0

    constructor({ transportLayer }) {
        this.transportLayer = transportLayer
    }

    initialise() {
        console.log('[PlayerStore.js:initialise]', 'this.CastPlayer', this.CastPlayer)
        if (!this.CastPlayer) {
            const playerDiv = document.getElementById('player')
            this.CastPlayer = new sampleplayer.CastPlayer(playerDiv, payload => {
                console.log('[PlayerStore.js:initialising', 'payload', payload)
                this.initialiseWithPayload(payload)
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
        const offset = timer.offset
        if (timer.stopped) {
            return timer.time + offset
        } else {
            const delta = this.currentTimeInPlayer - timer.at
            return timer.time + delta + offset
        }
    }

    async fetchPlayerSponsors(tvId, competitionId) {
        console.log('[PlayerStore.js:fetchPlayerSponsors]', 'tvId', tvId, 'competitionId', competitionId)
        const response = await this.transportLayer.fetchPlayerSponsors(tvId, competitionId)
        const json = await response.json()
        const [ campaign = {} ] = json

        console.log('[PlayerStore.js:fetchPlayerSponsors]', 'campaign', campaign  )

        if (campaign.campaign_spots && campaign.campaign_spots.length !== 0) {
            const playerSponsors = campaign.campaign_spots
                .concat()
                .filter(spot => spot.slug.startsWith('tv-header'))

            if (playerSponsors.length !== 0) {
                this.playerSponsors = playerSponsors
            } else {
                this.playerSponsors = false
            }

            const scoreboardSponsor = campaign.campaign_spots
                .concat()
                .find(spot => spot.slug === 'scoreboard')

            if (scoreboardSponsor) {
                this.scoreboardSponsor = scoreboardSponsor
            } else {
                this.scoreboardSponsor = false
            }
        }
    }

    @action.bound
    async initialiseWithPayload(payload) {
        const { metadata } = payload

        this.type = metadata.highlightId
            ? 'HIGHLIGHT'
            : 'EVENT'

        console.log('[PlayerStore.js:initialiseWithPayload]', 'payload', payload, 'type', this.type)

        if (this.type === 'HIGHLIGHT') {
            const needsUpdate = this.highlightId !== metadata.highlightId
            console.log('[PlayerStore.js:initialiseWithPayload]', 'needsUpdateHIGHLIGHT', needsUpdate)

            if (needsUpdate) {
                this.highlightId = parseInt(metadata.highlightId, 10)
                this.eventId = null

                const response = await this.transportLayer.fetchHighlightInfo(this.highlightId)
                const json = await response.json()
                this.eventId = json.event_id
                this.timer.offset = json.meta_data.offset
                this.timer.matchTime = json.meta_data.match_time
            }
        } else {
            this.highlightId = null
            this.eventId = metadata.eventId
            this.timer.offset = 0
            this.timer.matchTime = 0
        }

        const needsUpdate = metadata.eventId && this.eventId !== metadata.eventId
        console.log('[PlayerStore.js:initialiseWithPayload]', 'needsUpdate', needsUpdate)

        if (needsUpdate) {
            const response = await this.transportLayer.fetchEventInfo(this.eventId)
            const json = await response.json()
            this.updateFromJson(json)
            if(json.tv_id && json.competition_id) {
                this.fetchPlayerSponsors(json.tv_id, json.competition_id)
            } else {
                this.playerSponsors = false
                this.scoreboardSponsor = false
            }
        }
    }

    @action.bound
    getTimeFromPlayer() {
        this.checkTimeout = setTimeout(() => {
            const mediaElement = this.CastPlayer.getMediaElement()
            if (mediaElement && mediaElement.currentTime) {
                this.currentTimeInPlayer = mediaElement.currentTime
                console.log('[PlayerStore.js:getTimeFromPlayer]', 'currentTimeInPlayer', this.currentTimeInPlayer)
            }
            this.check = requestAnimationFrame(() => this.getTimeFromPlayer())
        }, 1000)
    }

    @action.bound
    updateFromJson(json) {
        console.log('[PlayerStore.js:updateFromJson]', 'json', json)

        this.team_away = {
            ...json.match_data.team_away,
            logo: checkUrlInLogo(json.match_data.team_away.logo),
        }

        this.team_home = {
            ...json.match_data.team_home,
            logo: checkUrlInLogo(json.match_data.team_home.logo),
        }

        this.competitionName = json.description
    }

    @action.bound
    reset() {
        this.timer.time = 0
        this.timer.at = 0
        this.timer.enabled = false
        this.timer.stopped = true
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
        clearTimeout(this.checkTimeout)
        this.checkTimeout = null
    }
}
