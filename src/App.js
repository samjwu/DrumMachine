import React from 'react';

import {drumPads} from './drumpads.js'

import './App.scss';

class DrumPad extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drumButtonStyle: {
        backgroundColor: 'grey'
      }
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.toggleDrumButtons = this.toggleDrumButtons.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(e) {
    if (e.key.toUpperCase() === this.props.keyboardKey) {
      this.playSound();
    }
  }

  toggleDrumButtons() {
    this.setState(prevState => ({
      drumButtonStyle: {
        backgroundColor: prevState.drumButtonStyle.backgroundColor === 'orange' ? 'grey' : 'orange'
      }
    }));
  }

  playSound() {
    const sound = document.getElementById(this.props.keyboardKey);
    sound.currentTime = 0;
    sound.play();
    this.toggleDrumButtons();
    setTimeout(() => this.toggleDrumButtons(), 100);
    this.props.updateDisplay(this.props.clipId.replace(/-/g, ' '));
  }

  render() {
    return (
      <div
        className='drum-pad'
        id={this.props.clipId}
        onClick={this.playSound}
        style={this.state.drumButtonStyle}
      >
        <audio
          className='clip'
          id={this.props.keyboardKey}
          src={this.props.clip}
        />
        {this.props.keyboardKey}
      </div>
    );
  }
}

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let drumMachine;

    drumMachine = this.props.drumPadSource.map((drumObj, i, drumPads) => {
      return (
        <DrumPad
          clip={drumPads[i].clipSrc}
          clipId={drumPads[i].clipId}
          keyboardKey={drumPads[i].keyboardKey}
          updateDisplay={this.props.updateDisplay}
        />
      );
    });

    return <div id='drum-grid'>{drumMachine}</div>;
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: String.fromCharCode(160),
      drumPadSource: drumPads,
      volume: 0.5
    };

    this.displayClipName = this.displayClipName.bind(this);
    this.adjustVolume = this.adjustVolume.bind(this);
  }

  displayClipName(name) {
    this.setState({
      display: name
    });
  }

  adjustVolume(e) {
    this.setState({
      volume: e.target.value,
      display: 'Volume: ' + Math.round(e.target.value * 100)
    });
  }

  render() {
    {
      const clips = [].slice.call(document.getElementsByClassName('clip'));
      clips.forEach(sound => {
        sound.volume = this.state.volume;
      });
    }

    return (
      <div id='drum-machine'>
        <DrumMachine
          clipVolume={this.state.volume}
          drumPadSource={this.state.drumPadSource}
          updateDisplay={this.displayClipName}
        />

        <div>
          <p id='display'>{this.state.display}</p>
          <div>
            <input
              max='1'
              min='0'
              onChange={this.adjustVolume}
              step='0.01'
              type='range'
              value={this.state.volume}
            />
          </div>
        </div>
      </div>
    );
  }
}
