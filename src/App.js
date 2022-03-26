import React from "react"
import { useState } from "react"
import OcrReader from "./components/OcrReader"
import SmsSender from "./components/SpotifySender"

function App() {
  const [ocrData, setOcrData] = useState("")

  // Receive OCR data as a prop from the child component
  const onReadOcrData = (ocrData) => {

    var myArray = ocrData.split(" - ")
    var test = myArray[Math.floor(Math.random()*myArray.length)];

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
    </div>
  )
}

export default App

