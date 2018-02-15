import React, { PureComponent } from 'react'
import styles from './GoalOverlay.css'

import checkUrlInLogo from '../../lib/checkUrlInLogo'

export default class GoalOverlay extends PureComponent {
    shouldComponentUpdate(nextProps) {
        if (nextProps.goal.id === this.props.goal.id) {
            return false
        }
        return true
    }
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

        const timer = this.props.playerStore.timer
        const elapsedSecondsAfterHighlightHappened = goal.currentTimeInPlayer - goal.offset
        const minuteFormatted = Math.ceil((timer + 1 - elapsedSecondsAfterHighlightHappened) / 60)
        const minute = minuteFormatted === 0
            ? minute
            : `${minuteFormatted}'`

        console.log('hello')

        return (
            <div className={styles.root}>
                <div className={this.props.hasSponsor ? styles.containerWithSponsor : styles.containerWithoutSponsor}>
                    <div className={styles.teamColor} style={{ backgroundColor: 'pink' }} />
                    <div className={styles.infoWrapper}>
                        <div className={styles.logoContainer}>
                            <img className={styles.logo} src={logoSrc} />
                        </div>
                        <div className={styles.info}>
                            <div className={styles.icon}>O</div>
                            <div className={styles.seperator} />
                            <p>{minute} {description}</p>
                        </div>
                        <div className={styles.player}>
                            {player}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
