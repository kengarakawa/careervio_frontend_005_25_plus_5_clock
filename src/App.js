import { useState } from "react"
import { useInterval } from "usehooks-ts"
import "./App.css"

function App() {
  const defaultBreakLength = 5
  const defaultSessionLength = 25

  const [sessionLength, setSessionLength] = useState(defaultSessionLength)
  const [breakLength, setBreakLength] = useState(defaultBreakLength)

  const [currentTimerType, setCurrentTimerType] = useState("session")
  const [timerLeft, setTimerLeft] = useState(defaultSessionLength * 60 * 1000)

  const [isCountingDown, setIsCountingDown] = useState(false)

  const getMs = (timerInMin) => Math.floor(60 * 1000 * timerInMin)
  
  const theInterval = 1000 

  useInterval(
    () => {
      if (timerLeft <= 0) {
        document.getElementById("beep").currentTime = 0
        document.getElementById("beep").play()
        setCurrentTimerType(
          currentTimerType === "session" ? "break" : "session"
        )
        setTimerLeft(
          currentTimerType === "session"
            ? getMs(breakLength)
            : getMs(sessionLength)
        )
        return
      }
      setTimerLeft(timerLeft - theInterval < 0 ? 0 : timerLeft - theInterval)
    },
    isCountingDown ? theInterval : null
  )

  const setBreak = (length) => {
    if ((breakLength <= 1 && length < 0) || (breakLength >= 60 && length > 0)) {
      return
    }
    setBreakLength(breakLength + length)
  }
  const setSession = async (length) =>  {
    if (
      (sessionLength <= 1 && length < 0) ||
      (sessionLength >= 60 && length > 0)
    ) {
      return
    }
    if (currentTimerType === "session" && !isCountingDown) {
      // ORIGINAL await setTimerLeft(getMs(sessionLength + length))
      setTimerLeft( prev => { 
        
        console.log(prev)
        return prev + (length * 60000)
      })
      // console.log( displayTimer(getMs(sessionLength + length))) 
    }
    setSessionLength(sessionLength + length)
    
  }

  const toggleTimer = () => {
    let elem = document.querySelector(".play-pause")
    elem.classList.toggle("fa-pause")
    elem.classList.toggle("fa-play")
    setIsCountingDown(!isCountingDown)

    // if(document.getElementById('beep').src === '') {
    //   document.getElementById('beep').src = 'assets/alarm.mp3'
    // }
  }

  const resetAll = () => {
    setSessionLength(defaultSessionLength)
    setTimerLeft(getMs(defaultSessionLength))
    setBreakLength(defaultBreakLength)
    setCurrentTimerType("session")
    setIsCountingDown(false)

    document.getElementById("beep").pause()
    document.getElementById("beep").currentTime = 0
  }

  const displayTimer = (value = null) => {
    if (value != null) {
      let timerMin = Math.floor(value / 60000).toString()
      let timerSec = Math.floor((value % 60000) / 1000).toString()

      if (timerMin.length === 1) {
        timerMin = `0${timerMin}`
      }
      if (timerSec.length === 1) {
        timerSec = `0${timerSec}`
      }
      return `${timerMin}:${timerSec}`
    }
    let timerMin = Math.floor(timerLeft / 60000).toString()
    let timerSec = Math.floor((timerLeft % 60000) / 1000).toString()

    if (timerMin.length === 1) {
      timerMin = `0${timerMin}`
    }
    if (timerSec.length === 1) {
      timerSec = `0${timerSec}`
    }

    return `${timerMin}:${timerSec}`
  }

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <h1>25 + 5 Clock</h1>
        </div>
        <div className="row justify-content-center">
          <div className="col-3" id="session-label">
            Session Length
          </div>
          <div className="col-3" id="break-label">
            Break Length
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-3 ">
            <div
              className="inline btn"
              id="session-decrement"
              onClick={() => setSession(-1)}
            >
              <i className="fa fa-minus" aria-hidden="true"></i>
            </div>
            <div className="inline" id="session-length">
              {sessionLength}
            </div>
            <div
              className="inline btn"
              id="session-increment"
              onClick={() => setSession(1)}
            >
              <i className="fa fa-plus" aria-hidden="true"></i>
            </div>
          </div>

          <div className="col-3 ">
            <div
              className="inline btn"
              id="break-decrement"
              onClick={() => setBreak(-1)}
            >
              <i className="fa fa-minus" aria-hidden="true"></i>
            </div>
            <div className="inline" id="break-length">
              {breakLength}
            </div>
            <div
              className="inline btn"
              id="break-increment"
              onClick={() => setBreak(1)}
            >
              <i className="fa fa-plus" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-6 ">
            <div className="row">
              <div className="timer-type" id="timer-label">
                {currentTimerType}
              </div>
            </div>
            <div className="row">
              <div className="time-left" id="time-left">
                {displayTimer()}
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-6 ">
            <div className="btn" id="start_stop" onClick={toggleTimer}>
              <i
                className="play-pause fas fa-play fa-2x"
                id="labelPlayPause"
              ></i>
            </div>
            <div className="btn" id="reset" onClick={resetAll}>
              <i className="fas fa-redo-alt  fa-2x" id="labelReset"></i>
            </div>
          </div>
        </div>
      </div>

      <audio id="beep" src="assets/alarm.mp3"></audio>
      
      <div className="me">
        <img src="images/arakawacow.jpg" alt="me" />
      </div>
    </div>
  )
}

export default App
