import React, { PureComponent } from 'react'
import { Motion, spring } from 'react-motion'

import Freeze from '../../lib/components/Freeze'

import GoalOverlay from '../GoalOverlay'

import styles from './GoalOverlayContainer.css'

const settings = { stiffness: 110, damping: 20 }

export default class GoalOverlayContainer extends PureComponent {
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
                                    <GoalOverlay {...this.props} />
                                )
                            }}
                        </Freeze>
                    </div>
                }
            </Motion>
        )
    }
}
