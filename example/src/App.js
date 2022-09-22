import React from 'react'

import AudioReactRecorder, { RecordState } from 'react-recorder-custom'
import 'react-recorder-custom/dist/index.css'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recordState: null,
      audioData: null,
      device: null,
      listDevices:[]
    }
  }

  componentDidMount(){
    this.getDevices()
  }

  start = () => {
    this.setState({
      recordState: RecordState.START
    })
  }

  pause = () => {
    this.setState({
      recordState: RecordState.PAUSE
    })
  }

  stop = () => {
    this.setState({
      recordState: RecordState.STOP
    })
  }

  onStop = (data) => {
    this.setState({
      audioData: data
    })
    console.log('onStop: audio data', data)
  }

  onError = (error) => {
    console.log(error)
  }


  onChangeDevice = (e) =>{
    console.log(e.target.value)
    this.setState({
      device:e.target.value
    })
  }

  getDevices = () =>{
    if(navigator && typeof window !== 'undefined'){
      navigator.mediaDevices.enumerateDevices()
      .then(async (res) =>{
        console.log(res)
        if(res.length){
          let tab = []
          for await(const el of res){
            if(el.kind === 'audioinput'){
              tab.push(el)
            }
          }
          if(tab.length){
            this.setState({
              listDevices: tab
            })
          }
        }
      })
      .catch((e)=>console.log(e))
    }
  }

  render() {
    const { recordState, listDevices } = this.state
    return (
      <div>


        <AudioReactRecorder
          state={recordState}
          onStop={this.onStop}
          backgroundColor='rgb(255,255,255)'
          onError={this.onError}
          inputDevice={this.state.device}
        />
        
        <h5 style={{ color: 'black' }}>Choose audio input device:</h5>

        <select value={this.state.device} onChange={this.onChangeDevice}>
          {
            listDevices.map((el) => <option key={el.deviceId} value={el.deviceId}>{el.label}</option>)
          }
        </select>

        <br></br><br></br>
        <audio
          id='audio'
          controls
          src={this.state.audioData ? this.state.audioData.url : null}
        ></audio>
        <button id='record' onClick={this.start}>
          Start
        </button>
        <button id='pause' onClick={this.pause}>
          Pause
        </button>
        <button id='stop' onClick={this.stop}>
          Stop
        </button>
      </div>
    )
  }
}

export default App
