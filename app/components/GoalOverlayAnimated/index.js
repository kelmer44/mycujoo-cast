import React, { PureComponent } from 'react'
import { Motion, spring } from 'react-motion'
import { observer } from 'mobx-react'

import GoalOverlayFreezer from '../GoalOverlayFreezer'

const settings = { stiffness: 120, damping: 19 }

@observer
export default class GoalOverlayAnimated extends PureComponent {
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
