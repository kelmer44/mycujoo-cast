import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'
import Scoreboard from 'mycujoo-scoreboard'

import '../assets/reset.css'
import '../assets/cast.css'
import '!style-loader!css-loader!../assets/player.css'

import Player from './components/Player'
import DebugPlayer from './components/DebugPlayer'
import GoalOverlayAnimated from './components/GoalOverlayAnimated'
import Sponsors from './components/Sponsors'
import CurrentTime from './components/CurrentTime'

import TransportLayer from './transportLayer'
import RootStore from './stores/'

const transportLayer = new TransportLayer()
const rootStore = new RootStore(transportLayer)

const show = observable({
    statsForNerds: false,
    currentTime: true
})

window.rootStore = rootStore
window.show = show

@observer
export default class App extends Component {
    componentDidMount() {
        rootStore.playerStore.initialise()
    }

    render() {
        return (
            <div data-player>
                <Player
                    playerStore={rootStore.playerStore}
                />
                <DebugPlayer
                    show={show.statsForNerds}
                />
                <Scoreboard
                    metaData={{
                        score: rootStore.playerStore.score,
                        timer: {
                            enabled: rootStore.playerStore.timer.enabled,
                            time: rootStore.playerStore.realTimer,
                        },
                        team_home: rootStore.playerStore.team_home,
                        team_away: rootStore.playerStore.team_away,
                    }}
                    sponsor={rootStore.playerStore.scoreboardSponsor}
                    forceScoreHidden={false}
                    competition={rootStore.playerStore.competitionName}
                    onLoadSponsor={() => {}}
                    onViewSponsor={() => {}}
                    onClickSponsor={() => {}}
                />
                <GoalOverlayAnimated
                    timer={rootStore.playerStore.realTimer}
                    teamHome={rootStore.playerStore.team_home}
                    teamAway={rootStore.playerStore.team_away}
                    disabled={rootStore.goalStore.disabled}
                    goal={rootStore.goalStore.currentGoal}
                />
                <Sponsors
                    sponsors={rootStore.playerStore.playerSponsors}
                />
                <CurrentTime
                    show={show.currentTime}
                    value={`${rootStore.playerStore.videoTime} / ${rootStore.playerStore.videoOffset}`}
                />
                {DEV && <DevTools />}
            </div>
        )
    }
}
