import React, { PureComponent } from 'react'
import { Motion, spring } from 'react-motion'

import GoalOverlayFreezer from '../GoalOverlayFreezer'

import styles from './GoalOverlayContainer.css'

const settings = { stiffness: 120, damping: 19 }

export default class GoalOverlayContainer extends PureComponent {
    render() {
        return (
            <Motion
              defaultStyle={{ height: 0 }}
              style={{
                  height: spring(this.props.disabled ? 0 : 100, settings)
              }}
            >
                {style =>
                    <GoalOverlayFreezer {...this.props} style={style} />
                }
            </Motion>
        )
    }
}
