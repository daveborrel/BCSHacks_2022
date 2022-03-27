import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import OcrReader from "./components/OcrReader"
import SpotifySender from "./components/SpotifySender"
import axios from 'axios';

function App() {
  const [ocrData, setOcrData] = useState("")

  // Spotify API
  const CLIENT_ID = "661ba48ba8704beca5caae215fec26b5"
  const REDIRECT_URI = "http://localhost:3000/callback"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  var artistID = ""
  var track1 = ""
  var track2 = ""
  var track3 = ""
  var playlistID = ""

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
    setSearchKey(test)
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
    setArtists(data.artists.items);
    artistID = data.artists.items[0].uri.substring(15);
    getTracks();
  }

  // get top three tracks of artist
  const getTracks = async (e) => {
    fetch("https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?market=US", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
        limit: 1
      },
      method: "GET"
    })     
    .then(response => response.json())
    .then(responseJSON => {
      track1 = responseJSON.tracks[0].uri;
      track2 = responseJSON.tracks[1].uri;
      track3 = responseJSON.tracks[2].uri;
    });

    getPlaylist();
    addToPlaylist();
  };

    // get newly created playlist
    const getPlaylist = async (e) => {
      fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET"
      })     
      .then(response => response.json())
      .then(responseJSON => {
        console.log(responseJSON.items[0].uri);
        console.log(playlistID);
      });
    };

  // add tracks to playlist
  const addToPlaylist = async (e) => {
    fetch("https://api.spotify.com/v1/playlists/{playlist_id}/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        playlist_id: playlistID,
        uris: track1 + "," + track2 + "," + track3,
      },
      method: "POST"
    })     
    .then(response => response.json())
    .then(responseJSON => {
      console.log(responseJSON.items[0].uri);
    });
  };


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

