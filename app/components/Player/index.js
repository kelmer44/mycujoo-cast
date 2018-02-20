import React, { PureComponent } from 'react'
import { observer } from 'mobx-react'

@observer
export default class Player extends PureComponent {
    render() {
        return (
            <div id="player" className="player">
                <div className="media">
                    <video></video>
                </div>
                <div className="logo"></div>
                <div className="spinner"></div>
                <div className="watermark"></div>
                <div className="gradient"></div>
                <div className="overlay">
                    <div className="media-info">
                        <div className="media-artwork"></div>
                        <div className="media-text">
                            <div className="media-title"></div>
                            <div className="media-subtitle"></div>
                        </div>
                    </div>
                    <div className="preview-mode-info">
                        <div className="preview-mode-artwork"></div>
                        <div className="preview-mode-text">
                            <div className="preview-mode-timer">
                                <div className="preview-mode-timer-starts">Up next in&nbsp;</div>
                                <div className="preview-mode-timer-countdown"></div>
                                <div className="preview-mode-timer-sec">&nbsp;secs...</div>
                            </div>
                            <div className="preview-mode-title"></div>
                            <div className="preview-mode-subtitle"></div>
                        </div>
                    </div>
                    <div className="controls">
                        <span className="controls-play-pause"></span>
                        <span className="controls-cur-time"></span>
                        <span className="controls-total-time"></span>
                        <div className="controls-progress">
                            <div className="controls-progress-inner progressBar"></div>
                            <div className="controls-progress-thumb"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
