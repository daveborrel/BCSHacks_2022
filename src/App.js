import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import OcrReader from "./components/OcrReader"
import SpotifySender from "./components/SpotifySender"
import axios from 'axios';

function App() {
  const [ocrData, setOcrData] = useState("")

  // Spotify API
  const CLIENT_ID = "55ee11e7110b4bfe8d1466e85f42fb78"
  const REDIRECT_URI = "http://localhost:3000/callback"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  var artistID = ""

    let newOcrData = ""
    var myArray = ""

  // Receive OCR data as a prop from the child component
  const onReadOcrData = (ocrData) => {

    let newOcrData = ocrData.replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ");
    myArray = newOcrData.split(" ")

    for (let i = 0; i < myArray; i++) {
      // TODO:
      // for every element of myArray, we can use the Spotify /search api to find top 1 artist
      // and grab the artist_id directly.
    }

    var test = myArray[Math.floor(Math.random() * myArray.length)];
    setOcrData(test)
  }

  // Prop detects that the change image button was clicked
  const onRemoveClicked = () => {
    setOcrData("")
  }

  // Spotify 
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

  // logout button 
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  // search artist function 
  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "artist",
            limit: 1
        }
    })
    
    setArtists(data.artists.items)
    artistID = data.artists.items[0].uri.substring(15);

    const {tracks} = await axios.get("https://api.spotify.com/v1/artists/{id}/top-tracks", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            id: artistID,
            market: "us"
        }
    })

    console.log(tracks.body);
  }

  // display artist function
  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
        {artist.name}
      </div>
    ))
  }

  return (
    <div className="App">
      <header>Festival Playlist Generator</header>
      <OcrReader
        onReadOcrData={onReadOcrData}
        onRemoveClicked={onRemoveClicked}
      />
      {ocrData}

    {/* Login to Spotify */}
    {!token ?
          <button><a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
          to Spotify</a></button>
          : <button onClick={logout}>Logout</button>}

    {token ?
          <form onSubmit={searchArtists}>
              <input type="text" onChange={e => setSearchKey(e.target.value)}/>
              <button type={"submit"}>Search</button>
          </form>
          : <h2>Please login</h2>
        }

      {renderArtists()}
    </div>
  )
}

export default App

