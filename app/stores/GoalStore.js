import { computed, observable, action, reaction } from 'mobx'

const emptyId = -1

export default class GoalStore {

    @observable disabled = true
    timeout

    constructor(rootStore) {
        this.rootStore = rootStore
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
        clearTimeout(this.timeout)

        if (isEmpty) {
            return this.disabled = true
        }

        this.disabled = false

        this.timeout = setTimeout(() => {
            requestAnimationFrame(() => {
                this.disabled = true
            })
        }, 7500)
    }

    @computed
    get currentGoal() {
        const goal = this.rootStore.timelineStore.currentTimeline
            .concat()
            .reverse()
            .find(item => item.data && item.data.type === 'goal')

        const { playerStore } = this.rootStore

        if (goal && goal.offset &&
            playerStore.relativeTime >= goal.offset + 3 &&
            playerStore.relativeTime <= goal.offset + 3 + 20
        ) {
            goal.relativeTime = parseInt(this.rootStore.playerStore.relativeTime, 10)
            return goal
        }

        return { id: emptyId }
    }

    dispose() {
        this.showGoalReaction()
    }
}
