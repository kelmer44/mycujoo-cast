import React, { PureComponent } from 'react'
import styles from './Sponsors.css'

export default class Sponsors extends PureComponent {
    render() {
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
