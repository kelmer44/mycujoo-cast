import { observable, computed, action } from 'mobx'

import checkUrlInLogo from '../lib/checkUrlInLogo'

export default class PlayerStore {
    @observable score = {}
    @observable team_away = {}
    @observable team_home = {}
    @observable competitionId = false
    @observable competitionName = false
    @observable scoreboardSponsor = false
    @observable playerSponsors = false
    @observable videoTime = 0
    @observable videoOffset = 0
    @observable eventId = false

    timer = observable({
        time: 0,
        at: 0,
        enabled: false,
        stopped: true,
    })

    tvId = false
    highlightId = false
    type = null
    checkTimeout = null
    CastPlayer = null

    constructor(rootStore) {
        this.rootStore = rootStore
    }

    initialise() {
        console.log('[PlayerStore.js:initialise]', 'this.CastPlayer', this.CastPlayer)

        if (DEV) {
            this.initialiseWithPayload({ metadata: { highlightId: 235802 }})
        } else {
            if (!this.CastPlayer) {
                const playerDiv = document.getElementById('player')
                this.CastPlayer = new sampleplayer.CastPlayer(playerDiv, payload => {
                    console.log('[PlayerStore.js:initialising', 'payload', payload)
                    this.initialiseWithPayload(payload)
                })
                this.CastPlayer.start()
            }
        }

        this.getTimeFromPlayer()
    }

    @computed
    get realTimer() {
        const { timer } = this
        if (timer.stopped) {
            return timer.time + this.videoOffset
        } else {
            const delta = this.videoTime - timer.at
            return timer.time + delta + this.videoOffset
        }
    }

    @computed
    get relativeTime() {
        return this.videoOffset + this.videoTime
    }

    async fetchPlayerSponsors(tvId, competitionId) {
        console.log('[PlayerStore.js:fetchPlayerSponsors]', 'tvId', tvId, 'competitionId', competitionId)
        const response = await this.rootStore.transportLayer.fetchPlayerSponsors(tvId, competitionId)
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

                const response = await this.rootStore.transportLayer.fetchHighlightInfo(this.highlightId)
                const json = await response.json()

                this.eventId = json.event_id
                this.videoOffset = json.meta_data.offset
                    - (Math.abs(new Date(json.stopped_at) - new Date(json.started_at)) / 2 / 1000)
                this.timer.matchTime = json.meta_data.match_time
            }
        } else {
            this.highlightId = false
            this.videoOffset = 0
            this.timer.matchTime = 0
        }

        const needsUpdate = this.eventId !== metadata.eventId
        console.log('[PlayerStore.js:initialiseWithPayload]', 'needsUpdate', needsUpdate, 'this.eventId', this.eventId)

        if (this.type === 'EVENT') {
            this.eventId = metadata.eventId
            console.log('[PlayerStore.js:initialiseWithPayload]', 'metadata.eventId', metadata.eventId)
        }

        if (needsUpdate) {
            const json = await this.rootStore.transportLayer.fetchEventInfo(this.eventId).then(r => r.json())
            this.updateFromJson(json)

            if(json.live === 1) {
                this.videoOffset = Math.max(this.videoOffset - 9, 0)
            }

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
            if (DEV) {
                this.videoTime = this.videoTime + 1
            } else {
                const mediaElement = this.CastPlayer.getMediaElement()
                if (mediaElement && mediaElement.currentTime) {
                    this.videoTime = Math.floor(mediaElement.currentTime)
                }
            }
            // console.log('[PlayerStore.js:getTimeFromPlayer]', 'videoTime', this.videoTime)
            requestAnimationFrame(() => {
                this.getTimeFromPlayer()
            })
        }, DEV ? 1000 : 250)
    }

    @action.bound
    updateFromJson(json) {
        console.log('[PlayerStore.js:updateFromJson]', 'json', json)

        if(json.match_data) {
            if (json.match_data.team_away) {
                this.team_away = {
                    ...json.match_data.team_away,
                    logo: checkUrlInLogo(json.match_data.team_away.logo),
                }
            }

            if (json.match_data.team_home) {
                this.team_home = {
                    ...json.match_data.team_home,
                    logo: checkUrlInLogo(json.match_data.team_home.logo),
                }
            }
        }

        this.competitionName = json.description
    }

    @action.bound
    resetScoreboard() {
        console.log('[PlayerStore.js:resetScoreboard]')
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
    timerShown() {
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
        clearTimeout(this.checkTimeout)
        this.checkTimeout = null
    }
}
