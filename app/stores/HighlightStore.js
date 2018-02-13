import { observable, computed } from 'mobx'

export class Item {
    @observable data = {}

    constructor(store, json) {
        Object.assign(this.data, json)
        this.store = store
    }

    @computed get asJson() {
        return this.data
    }

    updateFromJson(json) {
        Object.assign(this.data, json)
    }

    remove() {
        this.store.removeHighlight(this)
    }
}

const goalActions = [
    'score_increased',
    'score_decreased'
]

const scoreboardActions = [
    'score_increased',
    'score_decreased',
    'score_shown',
    'score_hidden',
    'timer_shown',
    'timer_hidden',
    'timer_started',
    'timer_stopped',
    'timer_updated',
]

const isGoalAction = item => goalActions.includes(item.type)
const isScoreboardAction = item => scoreboardActions.includes(item.type)

export default class TimelineStore {
    transportLayer

    timeline = []

    constructor(transportLayer, playerStore) {
        this.playerStore = playerStore
        this.transportLayer = transportLayer
        this.transportLayer.on('receiveHighlightsUpdate', () =>
            this.loadOrUpdateHighlights()
        )
        this.transportLayer.on('receiveHighlightUpdate', updatedHighlight =>
            this.updateHighlightFromServer(updatedHighlight)
        )
        this.loadOrUpdateHighlights()
    }

    loadOrUpdateHighlights() {
        this.transportLayer.fetchTimeline().then(fetchedHighlights => {
            fetchedHighlights.forEach(json => this.updateHighlightFromServer(json))
        })
    }

    updateHighlightFromServer(json) {
        const item = this.timeline.find(item => item.id === json.id)
        if (!item) {
            this.createHighlight(json)
        } else if (json.isDeleted) {
            this.removeHighlight(item)
        } else {
            item.updateFromJson(json)
        }
    }

    createHighlight(json) {
        const item = new Item(this, json)
        this.timeline.push(item)
        return item
    }

    removeHighlight(item) {
        this.timeline.splice(this.timeline.indexOf(item), 1)
    }

    @computed get currentGoals() {
        return this.timeline
            .filter(isGoalAction)
            .filter(item => {
                // 3s delay to wait for goal to show item
                // show goal for 20s
                return (
                    this.playerStore.currentTime >= item.elapsed_time + 3
                    && this.playerStore.currentTime <= item.elapsed_time + 3 + 20
                )
            })
    }
}
