import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Scoreboard from 'mycujoo-scoreboard'

import '../assets/cast.css'
import '!style-loader!css-loader!../assets/player.css'
import './app.css'

import Player from './components/Player'
import DebugPlayer from './components/DebugPlayer'
import GoalOverlay from './components/GoalOverlayContainer'
import Sponsors from './components/Sponsors'

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
const showCurrentTime = true

const CurrentTime = ({ time }) => {
    return (
        <div style={{
            position: 'absolute',
            right: '32px',
            bottom: '32px',
            zIndex: 10,
            borderRadius: '4px',
            background: 'white',
            color: '#222224',
            padding: '4px 16px',
            fontSize: '22px',
            textAlign: 'center',
        }}>
            {time}
        </div>
    )
}

@observer
export default class App extends Component {
    render() {
        return (
            <div data-player>
                <Player playerStore={playerStore} />
                {showStatsForNerds && <DebugPlayer />}
                <Scoreboard
                    metaData={{
                        score: playerStore.score,
                        timer: {
                            enabled: playerStore.timer.enabled,
                            time: playerStore.realTimer,
                        },
                        team_home: playerStore.team_home,
                        team_away: playerStore.team_away,
                    }}
                    sponsor={playerStore.scoreboardSponsor}
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
                {playerStore.playerSponsors !== false && (
                    <Sponsors sponsors={playerStore.playerSponsors} />
                )}
                <CurrentTime time={playerStore.currentTimeInPlayer.toFixed(2)} />
            </div>
        )
    }
}
