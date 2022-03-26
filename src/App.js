import logo from './logo.svg';
import './App.css';
import { useState } from "react"
import OcrReader from "./components/OcrReader"
import SpotifySender from "./components/SpotifySender"

// Spotify API
const CLIENT_ID = "55ee11e7110b4bfe8d1466e85f42fb78"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

function App() {
  const [ocrData, setOcrData] = useState("")

  // Receive OCR data as a prop from the child component
  const onReadOcrData = (ocrData) => {

    setOcrData(test)
  }

  // Prop detects that the change image button was clicked
  const onRemoveClicked = () => {
    setOcrData("")
  }

  return (
    <div className="App">
      <header>Welcome to the OCR app!</header>
      <OcrReader
        onReadOcrData={onReadOcrData}
        onRemoveClicked={onRemoveClicked}
      />
      {ocrData}

    {/* Login to Spotify */}
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
    </div>
  )
}

export default App

