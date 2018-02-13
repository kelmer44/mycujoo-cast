class PlayerStore {
    metaData = {
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
    }

    sponsor = {
        data: {
            link_url: null,
            image_url: null,
        }
    }

    increaseScore(team) {
        const side = team === 'home' ? 0 : 1
        this.metaData.score.data[side] = this.metaData.score.data[side] + 1
    }

    decreaseScore(team) {
        const side = team === 'home' ? 0 : 1
        this.metaData.score.data[side] = this.metaData.score.data[side] - 1
    }
}

export default PlayerStore
