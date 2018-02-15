import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Scoreboard from 'mycujoo-scoreboard'

import '../cast.css'
import '!style-loader!css-loader!../player.css'
import './app.css'

import Player from './components/Player'
import DebugPlayer from './components/DebugPlayer'
import GoalOverlay from './components/GoalOverlayContainer'

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

const showStatsForNerds = window.location.search.includes('statsForNerds')

@observer
export default class App extends Component {
    render() {
        return (
            <div data-player>
                <Player playerStore={playerStore} />
                {showStatsForNerds && <DebugPlayer />}
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
                <GoalOverlay
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
