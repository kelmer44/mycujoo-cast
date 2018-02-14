import { observable, action } from 'mobx'

const res = (window.devicePixelRatio || 1) * 70

function checkUrlInLogo(src) {
    return src.match(/http/)
        ? src
        : `https://mycujoo-static.imgix.net/${src}?w=${res}&h=${res}`
}

export default class PlayerStore {
    @observable scoreboard = {
        score: {},
        timer: {},
        team_away: {},
        team_home: {},
    }
    sponsor = false
    //{
        // data: {
        //     link_url: null,
        //     image_url: null,
        // },
    // }

    @observable currentTimeInPlayer = 1540

    constructor(transportLayer) {
        this.transportLayer = transportLayer
        this.check = requestAnimationFrame(() => this.updateTimeFromPlayer())

        this.fetchMatchInfo()

        // temp for dev
        setInterval(() => {
            console.log(this.currentTimeInPlayer)
            this.currentTimeInPlayer = this.currentTimeInPlayer + 1
            this.timerUpdated({ data: { elapsed: this.scoreboard.timer.time + 1 }})
        }, 1000)
    }

    @action.bound
    reset() {
        console.log('reset')
        this.scoreboard.timer = {
            time: 0,
            enabled: false,
            stopped: true,
        }
        this.scoreboard.score = {
            enabled: false,
            data: [
                0,
                0,
            ],
        }
    }

    @action.bound
    async fetchMatchInfo() {
        const response = await this.transportLayer.fetchMatchInfo()
        const { match_data: { team_away, team_home } } = await response.json()
        this.scoreboard.team_away = { ...team_away, logo: checkUrlInLogo(team_away.logo) }
        this.scoreboard.team_home = { ...team_home, logo: checkUrlInLogo(team_home.logo) }
    }

    updateTimeFromPlayer() {
        // get time from player
        // set into updateTime
        this.check = requestAnimationFrame(() => this.updateTimeFromPlayer())
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
    timerStarted() {

    }

    @action.bound
    timerStopped() {

    }

    @action.bound
    timerUpdated(item) {
        this.scoreboard.timer.time = item.data.elapsed
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
        const team = item.data.item === 'home' ? 0 : 1
        this.scoreboard.score.data[team] = this.scoreboard.score.data[team] + 1
    }

    @action.bound
    scoreDecreased(item) {
        const team = item.data.item === 'home' ? 0 : 1
        this.scoreboard.score.data[team] = this.scoreboard.score.data[team] - 1
    }

    dispose() {
        cancelAnimationFrame(this.check)
    }
}
