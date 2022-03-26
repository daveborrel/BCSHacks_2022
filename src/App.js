// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { useState } from "react"
import OcrReader from "./components/OcrReader"
import SmsSender from "./components/SpotifySender"

function App() {
  const [ocrData, setOcrData] = useState("")

  // Receive OCR data as a prop from the child component
  const onReadOcrData = (ocrData) => {
    setOcrData(ocrData)
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

