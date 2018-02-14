import React, { PureComponent } from 'react'
import { observer } from 'mobx-react'
import Scoreboard from 'mycujoo-scoreboard'

import '../cast.css'
import './app.css'

import Player from './components/Player'
import DebugPlayer from './components/DebugPlayer'
import GoalOverlayContainer from './components/GoalOverlayContainer'

import PlayerStore from './stores/PlayerStore'
import TimelineStore from './stores/TimelineStore'
import GoalStore from './stores/GoalStore'

import TransportLayer from './transportLayer'

const transportLayer = new TransportLayer()
const playerStore = new PlayerStore({ transportLayer })
const timelineStore = new TimelineStore({ transportLayer, playerStore })
const goalStore = new GoalStore({ playerStore, timelineStore })

window.playerStore = playerStore
window.timelineStore = timelineStore
window.goalStore = goalStore

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
                    competition={playerStore.competition}
                    onLoadSponsor={() => {}}
                    onViewSponsor={() => {}}
                    onClickSponsor={() => {}}
                />
                <GoalOverlayContainer
                    playerStore={{
                        currentTimeInPlayer: playerStore.currentTimeInPlayer,
                        timer: playerStore.timer,
                    }}
                    teams={{
                        home: playerStore.scoreboard.team_home,
                        away: playerStore.scoreboard.team_away,
                    }}
                    disabled={goalStore.disabled}
                    goal={goalStore.currentGoal}
                />
            </div>
        )
    }
}
