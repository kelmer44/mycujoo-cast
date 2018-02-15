import React, { PureComponent } from 'react'
import styles from './Sponsors.css'

export default class DebugPlayer extends PureComponent {
    render() {
        return (
            <div className={styles.root}>
                {this.props.sponsors.map(({ data }) => (
                    <div className={styles.spot}>
                        <img src={data.image_url} className={styles.image} />
                    </div>
                ))}
            </div>
        )
    }
}
