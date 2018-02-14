import React, { PureComponent } from 'react'
import { observer } from 'mobx-react'
import Scoreboard from 'mycujoo-scoreboard'
import Player from './components/Player'
import DebugPlayer from './components/DebugPlayer'
import '../cast.css'

import PlayerStore from './stores/PlayerStore'
import TimelineStore from './stores/TimelineStore'

import TransportLayer from './transportLayer'

const transportLayer = new TransportLayer()
const playerStore = new PlayerStore(transportLayer)
const timelineStore = new TimelineStore(transportLayer, playerStore)

window.playerStore = playerStore
window.timelineStore = timelineStore

@observer
export default class App extends PureComponent {
    render() {



        return (
            <div data-player>
                <Player />
                <DebugPlayer />
                <Scoreboard
                    metaData={playerStore.scoreboard}
                    sponsor={playerStore.sponsor}
                    forceScoreHidden={false}
                    competition={'Some Competition'}
                    onLoadSponsor={() => {}}
                    onViewSponsor={() => {}}
                    onClickSponsor={() => {}}
                />
            </div>
        )
    }
}
