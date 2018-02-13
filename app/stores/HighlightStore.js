import { observable, autorun } from 'mobx'
import { fromPromise } from 'mobx-utils'

export class Highlight {
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

export class HighlightStore {
    transportLayer

    highlights = []

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
        this.transportLayer.fetchHighlights().then(fetchedHighlights => {
            fetchedHighlights.forEach(json => this.updateHighlightFromServer(json))
        })
    }

    updateHighlightFromServer(json) {
        const highlight = this.highlights.find(highlight => highlight.id === json.id)
        if (!highlight) {
            this.createHighlight(json)
        } else if (json.isDeleted) {
            this.removeHighlight(highlight)
        } else {
            highlight.updateFromJson(json)
        }
    }

    createHighlight(json) {
        const highlight = new Highlight(this, json)
        this.highlights.push(highlight)
        return highlight
    }

    removeHighlight(highlight) {
        this.highlights.splice(this.highlights.indexOf(highlight), 1)
    }

    @computed get currentHighlights() {
        return this.highlights.filter(highlight => {
            // 3s delay to wait for goal to show highlight
            // show goal for 20s
            return (
                this.playerStore.currentTime >= highlight.elapsed_time + 3
                && this.playerStore.currentTime <= highlight.elapsed_time + 3 + 20
            )
        })
    }
}
