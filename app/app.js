import React, { PureComponent } from 'react'
import { observer } from 'mobx-react'
import Scoreboard from 'mycujoo-scoreboard'
import Player from './components/Player'
import DebugPlayer from './components/DebugPlayer'
import '../cast.css'

import PlayerStore from './stores/PlayerStore'

const playerStore = new PlayerStore()

@observer
export default class App extends PureComponent {
    render() {
        return (
            <div data-player>
                <Player />
                <DebugPlayer />
                <Scoreboard
                    metaData={playerStore.metaData}
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
