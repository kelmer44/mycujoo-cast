import { observable, computed, action, reaction } from 'mobx'
import camelCase from 'camelcase'

const FETCH_DELAY = 4000

const actionTypes = [
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
    transportLayer
    fetchTimeout
    @observable timeline = []

    constructor({ transportLayer, playerStore }) {
        this.playerStore = playerStore
        this.transportLayer = transportLayer
        this.setupReactions()
    }

    setupReactions() {
        // delay is debouncing
        this.fetchReaction = reaction(
            () => this.playerStore.currentTimeInPlayer,
            () => this.fetchTimeline(),
            { fireImmediately: true, delay: FETCH_DELAY },
        )

        // it's safe to compare .length since timeline does not remove events
        this.parseTimelineReaction = reaction(
            () => this.currentTimeline.length,
            () => this.parseTimeline(),
            { fireImmediately: true }
        )
    }

    @computed get currentTimeline() {
        return this.timeline
            .filter(item => this.playerStore.currentTimeInPlayer >= item.offset)
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
        try {
            const response = await this.transportLayer.fetchTimeline()
            const timeline = await response.json()
            if (timeline.length !== this.timeline.length) {
                this.timeline = timeline
            }
        } catch (e) {
            console.error('Booo', e)
        }
    }

    @action
    parseTimeline() {
        this.playerStore.reset()
        this.currentTimeline
            .forEach(item => {
                const type = camelCase(item.type)
                if (actionTypes.includes(type)) {
                    if(this.playerStore[type]) {
                        this.playerStore[type](item)
                    }
                }
            })
    }

    dispose() {
        this.fetchReaction.dispose()
        this.parseTimelineReaction.dispose()
    }
}
