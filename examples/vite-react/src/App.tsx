import { Fragment, useState } from "react"
import "./App.css"

import { useMicVAD, utils } from "@slr/vad-react"
import dayjs from "dayjs"

const nano = () => Math.random().toString(36).substring(2, 8)

const INIT_STAMP = Date.now()

function Main() {
  const [audioList, setAudioList] = useState<
    { uid: string; start: number; url: string }[]
  >([])
  const [flying, setFlying] = useState(0)
  const vad = useMicVAD({
    submitUserSpeechOnPause: false,
    startOnLoad: true,
    onFrameProcessed(_p, ev, stamp) {
      if (ev.chunk) {
        console.log("process", ev, stamp)
        setFlying((prev) => prev + 1 + (ev.aheadChunks?.length || 0))
      }
    },
    onSpeechEnd: (audio, start) => {
      setFlying(0)
      const wavBuffer = utils.encodeWAV(audio)
      const base64 = utils.arrayBufferToBase64(wavBuffer)
      const url = `data:audio/wav;base64,${base64}`
      setAudioList((old) => [{ uid: nano(), url, start }, ...old])
    },
  })

  return (
    <>
      <h1>Vite + React + @slr/vad</h1>
      <div
        className="card"
        style={{
          display: "grid",
          gap: "12px",
          alignItems: "center",
          gridTemplateColumns: "auto auto minmax(0, 1fr) ",
          paddingBottom: "12px",
        }}
      >
        <div style={{ width: "4em", textAlign: "center" }}>
          {vad.loading ? "加载中" : vad.userSpeaking ? "有动静" : "静默"}
        </div>
        <button
          disabled={vad.loading}
          onClick={() => {
            vad.toggle()
          }}
        >
          {vad.listening ? <span>{"Stop"}</span> : <span>{"Start"}</span>}
        </button>
        <div>
          <div
            style={{
              marginTop: 18,
              height: "1em",
              transition: "all 0.2s",
              width: `${Math.min(100, Math.max(0, flying))}%`,
              background: "yellowgreen",
            }}
          />
          <div
            style={{
              fontSize: 12,
              minHeight: "18px",
              marginTop: 4,
              paddingLeft: 4,
            }}
          >
            {flying ? `处理中... ${flying}` : ""}
          </div>
        </div>
      </div>
      <div
        className="playlist"
        style={{
          minHeight: "40vh",
          overflow: "auto",
          padding: "4px",
          background: "gray",
          borderRadius: "8px",
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "auto minmax(auto, 1fr)",
          gap: "4px",
          alignContent: "start",
        }}
      >
        {audioList.map((item) => {
          return (
            <Fragment key={item.uid}>
              <span style={{ fontSize: 12, color: "#000" }}>
                {dayjs(INIT_STAMP + item.start).format("YYYY-MM-DD HH:mm:ss")}
              </span>
              <audio controls src={item.url} />
            </Fragment>
          )
        })}
      </div>
    </>
  )
}

function App() {
  const [show, setShow] = useState(true)
  if (!show) {
    return <button onClick={() => setShow(true)}>{"显示"}</button>
  }
  return <Main />
}

export default App
