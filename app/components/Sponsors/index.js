import React, { PureComponent } from 'react'
import { observer } from 'mobx-react'
import styles from './Sponsors.css'

@observer
export default class Sponsors extends PureComponent {
    render() {
        if (!this.props.sponsors || this.props.sponsors.length === 0) {
            return null
        }

        return (
            <div className={styles.root}>
                {this.props.sponsors.map(({ data }, key) => (
                    <div className={styles.spot} key={key}>
                        <img src={data.image_url} className={styles.image} />
                    </div>
                ))}
            </div>
        )
    }
}
