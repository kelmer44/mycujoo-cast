import React from 'react'
import Scoreboard from 'mycujoo-scoreboard'
import Player from './components/Player'
import DebugPlayer from './components/DebugPlayer'
import '../cast.css'


const App = () => {
    return (
        <div data-player>
          <Player />
          <DebugPlayer />
          <Scoreboard
              metaData={{
                        timer: {
                            time: 30,
                            enabled: true,
                            stopped: false,
                        },
                        score: {
                            enabled: true,
                            data: [
                                0,
                                2,
                            ],
                        },
                        team_away: {
                            logo: 'http://www.placecage.com/42/42',
                            color: '#ff00ff',
                            name: 'Team 1',
                            abbr: 'ABC',
                        },
                        team_home: {
                            logo: 'http://www.placecage.com/41/41',
                            color: '#00ffff',
                            name: 'Team 2',
                            abbr: 'DEF',
                        },
                    }}
                    sponsor={{
                            data:{
                                link_url: '//mycujoo.tv',
                                image_url:'//placecage.com/80/80',
                            }
                          }
                    }
                    forceScoreHidden={false}
                    competition={'Some Competition'}
                    onLoadSponsor={() => {}}
                    onViewSponsor={() => {}}
                    onClickSponsor={() => {}}
              />
        </div>
    )
}

export default App
