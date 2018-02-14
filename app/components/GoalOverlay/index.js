import React, { PureComponent } from 'react'
import { Motion, spring } from 'react-motion'

import Freeze from '../../lib/Freeze'

import styles from './GoalOverlay.css'

const settings = { stiffness: 110, damping: 20 }

export default class GoalOverlay extends PureComponent {
    render() {
        return (
            <Motion
              defaultStyle={{ opacity: 0 }}
              style={{
                opacity: spring(this.props.disabled ? 0 : 1, settings)
              }}
            >
                {style =>
                    <div style={style}>
                        <Freeze
                          value={this.props.goal}
                          visible={!this.props.disabled}
                        >
                            {goal => {
                                if (goal.id === -1) {
                                    return null
                                }

                                return (
                                    <div className={styles.root}>
                                        {goal.id}
                                    </div>
                                )
                            }}
                        </Freeze>
                    </div>
                }
            </Motion>
        )
    }
}
