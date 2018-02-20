import PlayerStore from './PlayerStore'
import TimelineStore from './TimelineStore'
import GoalStore from './GoalStore'

export default class RootStore {
    constructor(transportLayer) {
        this.transportLayer = transportLayer
        this.playerStore = new PlayerStore(this)
        this.timelineStore = new TimelineStore(this)
        this.goalStore = new GoalStore(this)
    }
}

export {
    PlayerStore,
    TimelineStore,
    GoalStore,
}
