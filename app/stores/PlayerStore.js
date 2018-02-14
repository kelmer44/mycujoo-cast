import { observable, computed, action } from 'mobx'

import checkUrlInLogo from '../lib/checkUrlInLogo'

export default class PlayerStore {
    @observable scoreboard = {
        score: {},
        timer: {},
        team_away: {},
        team_home: {},
    }
    @observable sponsor = false

    @observable currentTimeInPlayer = 1678

    constructor({ transportLayer }) {
        this.transportLayer = transportLayer
        this.check = requestAnimationFrame(() => this.getTimeFromPlayer())
        this.fetchMatchInfo()
    }

    @computed
    get timer() {
        const { stopped, time, at } = this.scoreboard.timer

        if (stopped) {
            return time
        }

        const delta = this.currentTimeInPlayer - at
        return time + delta
    }

    async fetchMatchInfo() {
        const response = await this.transportLayer.fetchMatchInfo()
        const json = await response.json()
        this.updateFromJson(json)
    }

    @action.bound
    getTimeFromPlayer() {
        setTimeout(() => {
            this.currentTimeInPlayer = this.currentTimeInPlayer + 1
            this.check = requestAnimationFrame(() => this.getTimeFromPlayer())
        }, 1000)
    }

    @action.bound
    updateFromJson(json) {
        this.scoreboard.team_away = {
            ...json.match_data.team_away,
            logo: checkUrlInLogo(json.match_data.team_away.logo),
        }

        this.scoreboard.team_home = {
            ...json.match_data.team_home,
            logo: checkUrlInLogo(json.match_data.team_home.logo),
        }

        if(json.sponsor) {
            this.sponsor = json.sponsor
        }
    }

    @action.bound
    reset() {
        this.scoreboard.timer = {
            time: 0,
            at: 0,
            enabled: false,
            stopped: true,
        }
        this.scoreboard.score = {
            enabled: false,
            data: [ 0, 0 ],
        }
    }

    @action.bound
    timerShown(item, state) {
        this.scoreboard.timer.enabled = true
    }

    @action.bound
    timerHidden() {
        this.scoreboard.timer.enabled = false
    }

    @action.bound
    timerStarted(item) {
        this.scoreboard.timer.time = item.data.elapsed
        this.scoreboard.timer.at = item.offset
        this.scoreboard.timer.stopped = false
    }

    @action.bound
    timerStopped(item) {
        this.scoreboard.timer.time = item.data.elapsed
        this.scoreboard.timer.at = item.offset
        this.scoreboard.timer.stopped = true
    }

    @action.bound
    timerUpdated(item) {
        this.scoreboard.timer.time = item.data.elapsed
        this.scoreboard.timer.at = item.offset
    }

    @action.bound
    scoreShown() {
        this.scoreboard.score.enabled = true
    }

    @action.bound
    scoreHidden() {
        this.scoreboard.score.enabled = false
    }

    @action.bound
    scoreIncreased(item) {
        const team = item.data.team === 'home' ? 0 : 1
        this.scoreboard.score.data[team] = this.scoreboard.score.data[team] + 1
    }

    @action.bound
    scoreDecreased(item) {
        const team = item.data.team === 'home' ? 0 : 1
        this.scoreboard.score.data[team] = this.scoreboard.score.data[team] - 1
    }

    dispose() {
        cancelAnimationFrame(this.check)
    }
}
