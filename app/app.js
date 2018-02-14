import React, { PureComponent } from 'react'
import { observer } from 'mobx-react'
import Scoreboard from 'mycujoo-scoreboard'

import '../cast.css'
import './app.css'

import Player from './components/Player'
import DebugPlayer from './components/DebugPlayer'
import GoalOverlay from './components/GoalOverlay'

import PlayerStore from './stores/PlayerStore'
import TimelineStore from './stores/TimelineStore'
import GoalStore from './stores/GoalStore'

import TransportLayer from './transportLayer'

const transportLayer = new TransportLayer()
const playerStore = new PlayerStore(transportLayer)
const timelineStore = new TimelineStore(transportLayer, playerStore)
const goalStore = new GoalStore(timelineStore, playerStore)

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
                    metaData={{
                        ...playerStore.scoreboard,
                        timer: {
                            ...playerStore.scoreboard.timer,
                            time: playerStore.timer,
                        }
                    }}
                    sponsor={playerStore.sponsor}
                    forceScoreHidden={false}
                    competition={'Some Competition'}
                    onLoadSponsor={() => {}}
                    onViewSponsor={() => {}}
                    onClickSponsor={() => {}}
                />
                <GoalOverlay />
            </div>
        )
    }
}
