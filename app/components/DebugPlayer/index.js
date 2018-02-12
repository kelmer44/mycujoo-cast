import React, { PureComponent } from 'react'
import './DebugPlayer.css'

export default class DebugPlayer extends PureComponent {
  render() {
    return (
      <div id="messages">
        <div id="title">Sample Media Receiver HUD</div>
        <div>Application State: <span id="applicationState">-</span></div>
        <div>Session Count: <span id="sessionCount">0</span></div>
        <div>Media Element State: <span id="mediaElementState">-</span></div>
        <div>Cast Receiver Manager Message: <span id="castReceiverManagerMessage">-</span></div>
        <div>Media Manager Message: <span id="mediaManagerMessage">-</span></div>
        <div>Message Bus Message: <span id="messageBusMessage">-</span></div>
        <div>Volume: <span id="volumeMessage">Unknown</span></div>
        <div>Host State: <span id="mediaHostState">Unknown</span></div>
        <div>Media Type: <span id="mediaType">Unkown</span></div>
        <div>Media Protocol: <span id="mediaProtocol">Unknown</span></div>
      </div>
    )
  }
}
