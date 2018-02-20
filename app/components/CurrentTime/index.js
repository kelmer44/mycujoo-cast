import React, { PureComponent } from 'react'
import { observer } from 'mobx-react'

@observer
export default class CurrentTime extends PureComponent {
    render() {
        if (!this.props.show) {
            return null
        }
        
        return (
            <div style={{
                position: 'absolute',
                right: '24px',
                bottom: '24px',
                zIndex: 10,
                borderRadius: '4px',
                background: 'white',
                color: '#222224',
                padding: '4px 16px',
                fontSize: '22px',
                textAlign: 'center',
            }}>
                {this.props.value}
            </div>
        )
    }
}
