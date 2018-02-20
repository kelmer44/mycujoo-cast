import { observable, computed, action, reaction, trace } from 'mobx'
import camelCase from 'camelcase'

const FETCH_DELAY = 7500

const scoreboardActionTypes = [
    'timer_shown',
    'timer_hidden',
    'timer_started',
    'timer_stopped',
    'timer_updated',
    'score_shown',
    'score_hidden',
    'score_increased',
    'score_decreased',
].map(i => camelCase(i))

export default class TimelineStore {
    @observable timeline = []

    constructor(rootStore) {
        this.rootStore = rootStore
        this.setupReactions()
    }

    setupReactions() {
        // this fetches timeline when the time in player has changed
        // delay is debouncing
        this.fetchReaction = reaction(
            () => this.rootStore.playerStore.videoTime,
            () => this.fetchTimeline(),
            { fireImmediately: true, delay: FETCH_DELAY },
        )

        // when the eventId has been fetched, update timeline too
        this.fetchOnEventIdReaction = reaction(
            () => this.rootStore.playerStore.eventId,
            () => this.fetchTimeline(),
        )

        // need to map ids since the timeline can have items removed and added
        this.parseTimelineReaction = reaction(
            () => this.currentTimeline.length,
            () => this.parseTimeline(),
            { fireImmediately: true }
        )
    }

    @computed get currentTimeline() {
        const { playerStore } = this.rootStore
        return this.timeline
            .filter(item => playerStore.relativeTime >= item.offset)
            .sort((a, b) => a.elapsed_time === b.elapsed_time
                ? a.id - b.id
                : a.elapsed_time - b.elapsed_time)
    }

    @computed get currentGoal() {
        return this.currentTimeline
            .concat()
            .reverse()
            .find(item =>
                item.data && item.data.type === 'goal'
            )
    }

    async fetchTimeline() {
        const eventId = this.rootStore.playerStore.eventId

        console.log('[TimelineStore.js:fetchTimeline]', 'eventId', eventId)

        try {
            if (!eventId) {
                return
            }

            const response = await this.rootStore.transportLayer.fetchTimeline(this.rootStore.playerStore.eventId)
            const timeline = await response.json()

            console.log('[TimelineStore.js:fetchTimeline]', 'timeline.length', timeline.length)

            if (timeline.length !== this.timeline.length) {
                this.timeline = timeline
            }
        } catch (e) {
            console.error('Booo', e)
        }
    }

    @action
    parseTimeline() {
        console.log('[TimelineStore.js:parseTimeline]')
        console.log('[TimelineStore.js:parseTimeline]', 'currentTimeline.length', this.currentTimeline.concat().length)

        this.rootStore.playerStore.resetScoreboard()

        this.currentTimeline
            .forEach(item => {
                const type = camelCase(item.type)
                if (scoreboardActionTypes.includes(type)) {

                    console.log('[TimelineStore.js:parseTimeline]', 'type', type)

                    if(this.rootStore.playerStore[type]) {
                        this.rootStore.playerStore[type](item)
                    }
                }
            })
    }

    dispose() {
        this.fetchReaction.dispose()
        this.fetchOnEventIdReaction.dispose()
        this.parseTimelineReaction.dispose()
    }
}
