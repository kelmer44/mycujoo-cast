import React, { PureComponent } from 'react'
import styles from './DebugPlayer.css'

export default class DebugPlayer extends PureComponent {
    render() {
        return (
            <div className={styles.messages}>
                <div className={styles.title}>Sample Media Receiver HUD</div>
                <div className={styles.message}>Application State <span className={styles.value} id="applicationState">-</span></div>
                <div className={styles.message}>Session Count <span className={styles.value} id="sessionCount">0</span></div>
                <div className={styles.message}>Media Element State <span className={styles.value} id="mediaElementState">-</span></div>
                <div className={styles.message}>Cast Receiver Manager Message <span className={styles.value} id="castReceiverManagerMessage">-</span></div>
                <div className={styles.message}>Media Manager Message <span className={styles.value} id="mediaManagerMessage">-</span></div>
                <div className={styles.message}>Message Bus Message <span className={styles.value} id="messageBusMessage">-</span></div>
                <div className={styles.message}>Volume <span className={styles.value} id="volumeMessage">Unknown</span></div>
                <div className={styles.message}>Host State <span className={styles.value} id="mediaHostState">Unknown</span></div>
                <div className={styles.message}>Media Type <span className={styles.value} id="mediaType">Unknown</span></div>
                <div className={styles.message}>Media Protocol <span className={styles.value} id="mediaProtocol">Unknown</span></div>
            </div>
        )
    }
}
