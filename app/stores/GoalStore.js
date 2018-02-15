import { computed, observable, action, reaction } from 'mobx'

const emptyId = -1

export default class GoalStore {

    @observable disabled = true
    timeout

    constructor({ playerStore, timelineStore }) {
        this.playerStore = playerStore
        this.timelineStore = timelineStore
        this.setupReactions()
    }

    setupReactions() {
        this.showGoalReaction = reaction(
            () => this.currentGoal.id,
            (id) => this.showGoal(id === emptyId),
        )
    }

    @action.bound
    showGoal(isEmpty) {
        console.log('showGoal', 'isEmpty', isEmpty)
        clearTimeout(this.timeout)
        if (isEmpty) {
            return this.disabled = true
        }

        this.disabled = false
        this.timeout = setTimeout(() => {
            console.log('disabled')
            this.disabled = true
        }, 7500)
    }

    @computed
    get currentGoal() {
        const goal = this.timelineStore.currentTimeline
            .concat()
            .reverse()
            .find(item => item.data && item.data.type === 'goal')

        if (goal && goal.offset &&
            this.playerStore.currentTimeInPlayer >= goal.offset + 3 &&
            this.playerStore.currentTimeInPlayer <= goal.offset + 3 + 20
        ) {
            goal.currentTimeInPlayer = parseInt(this.playerStore.currentTimeInPlayer, 10)
            return goal
        }

        return { id: emptyId }
    }

    dispose() {
        this.showGoalReaction()
    }
}
