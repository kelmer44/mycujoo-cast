import React, { PureComponent } from 'react'
import styles from './GoalOverlay.css'

import checkUrlInLogo from '../../lib/checkUrlInLogo'

import Icon from './Icon.svg'

export default class GoalOverlay extends PureComponent {
    shouldComponentUpdate(nextProps) {
        if (nextProps.goal.id === this.props.goal.id) {
            return false
        }
        return true
    }
    render() {
        const { goal, timer } = this.props

        console.log(goal)

        const team = this.props[goal.data.team === 'home'
            ? 'teamHome'
            : 'teamAway']

        const otherTeam = this.props[goal.data.team === 'away'
            ? 'teamAway'
            : 'teamHome']

        const name = goal &&
            goal.data &&
            goal.data.tagged_players &&
            goal.data.tagged_players.length > 0 &&
            goal.data.tagged_players[0].name

        const player = name || team.name

        const isOwnGoal = goal.data.outcome === 'own_goal'

        const description = isOwnGoal ? 'OWN GOAL' : 'GOAL'

        const logo = isOwnGoal
            ? team.logo
            : otherTeam.logo

        const logoSrc = logo.match(/http/)
            ? logo
            : checkUrlInLogo(logo, 70)

        const backgroundColor = team ? team.color : '#0BD280'

        const elapsedSecondsAfterHighlightHappened = goal.relativeTime - goal.offset
        const minuteFormatted = Math.ceil((timer + 1 - elapsedSecondsAfterHighlightHappened) / 60)
        const minute = minuteFormatted === 0
            ? minute
            : `${minuteFormatted}'`

        return (
            <div className={styles.root}>
                <div className={this.props.hasSponsor ? styles.containerWithSponsor : styles.containerWithoutSponsor}>
                    <div className={styles.teamColor} style={{ backgroundColor }} />
                    <div className={styles.infoWrapper}>
                        <div className={styles.logoContainer}>
                            <img className={styles.logo} src={logoSrc} />
                        </div>
                        <div className={styles.info}>
                            <div className={styles.iconContainer}><img src={Icon} className={styles.icon} /></div>
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
