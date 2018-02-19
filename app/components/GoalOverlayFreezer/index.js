import React, { PureComponent } from 'react'
import styles from './GoalOverlayFreezer.css'

import GoalOverlay from '../GoalOverlay'

import Freeze from '../../lib/components/Freeze'

export default class GoalOverlayFreezer extends PureComponent {
    render() {
        const { style, hasSponsor = false, goal, ...rest } = this.props
        return (
            <div className={hasSponsor ? styles.rootWithSponsor : styles.root}>
                <div style={{ height: `${style.height}%` }}>
                    <Freeze
                        value={goal}
                        visible={!this.props.disabled}
                    >
                        {goal => {
                            if (goal.id === -1) {
                                return null
                            }

                            return (
                                <GoalOverlay
                                    {...rest}
                                    hasSponsor={hasSponsor}
                                    goal={goal}
                                />
                            )
                        }}
                    </Freeze>
                </div>
            </div>
        )
    }
}
