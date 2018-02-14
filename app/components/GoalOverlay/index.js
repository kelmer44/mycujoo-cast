import React, { PureComponent } from 'react'
import styles from './GoalOverlay.css'

import checkUrlInLogo from '../../lib/checkUrlInLogo'

export default class GoalOverlay extends PureComponent {
    render() {
        const { goal, teams } = this.props
        const team = teams[goal.data.team]

        const otherTeam = teams[goal.data.team === 'home'
            ? goal.data.team
            : 'away']

        const name = goal.data.tagged_players[0].name
        const player = name || team.name
        const isOwnGoal = goal.data.outcome === 'own_goal'

        const logo = isOwnGoal
            ? team.logo
            : otherTeam.logo

        const logoSrc = logo.match(/http/)
            ? logo
            : checkUrlInLogo(logo, 70)

        const color = team ? team.color : '#fff'

        const description = isOwnGoal ? 'OWN GOAL' : 'GOAL'

        return (
            <div className={styles.root}>
                <img src={logoSrc} />
                {description}
                {player}
                {name}
            </div>
        )
    }
}
