import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import OcrReader from "./components/OcrReader"
import SpotifySender from "./components/SpotifySender"
import axios from 'axios';

function App() {
  const [ocrData, setOcrData] = useState("")

  // Spotify API
  const USER_ID = "christing19"
  const CLIENT_ID = "0802d1ebd8944a76bb0c37e6cab2a871"
  const REDIRECT_URI = "http://localhost:3000"
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

  
  // creates a playlist
  const createPlaylist = async (e) => {
    e.preventDefault()
    const emptyPlaylist = await fetch('https://api.spotify.com/v1/users/' + USER_ID + '/playlists', {
      method: 'POST',
      body: JSON.stringify({
        'name': 'Intersection Test',
        'public': true,
      }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert('Spotify Playlist Created!');
    });

    searchArtists();
  }

  const addTrack = (track_id) => {
    const track = fetch('https://api.spotify.com/v1/users/' + USER_ID + '/playlists', {
      method: 'POST',
      body: JSON.stringify({
        'name': 'Intersection Test',
        'public': false,
      }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
  }
  
    // Receive OCR data as a prop from the child component
  const onReadOcrData = (ocrData) => {

    let newOcrData = ocrData.replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ");
    myArray = newOcrData.split(" ")

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

    setToken("BQCcU_k2vxsERaVRHsC84ocowtusRQVfIxNZSZ10LGf5ZbB-Odat5hOElaYTPyw0SsSyProAiCSFtpL02nAHxqttZuDxmrbrl8dOH1VjHIO9aI3wT1ZzeYppuGnuNEXrWy98gdLu2lpbZhrMWyOEXeeINaSoMhJbr8OFMiIgzfmr4GSm3SLIvbsdCYfylA5Zbt8haJdNjImG2Q")

  }, [])

  // logout button 
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }
  
  // search artist function 
  const searchArtists = async (e) => {
    // e.preventDefault()
    // createPlaylist()
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
        playlistID = responseJSON.items[0].uri.substring(17);
        console.log(playlistID);
      });
    };

  // add tracks to playlist
  const addToPlaylist = async (e) => {
    fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        playlist_id: playlistID,
        uris: track1 + "," + track2 + "," + track3,
      },
      method: "POST"
    })
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
          <form onSubmit={createPlaylist}>
              <input type="text" onChange={e => setSearchKey(e.target.value)}/>
              <button type={"submit"}>Create Playlist!</button>
          </form>
          : <h2>Please login</h2>
        }

      {renderArtists()}
    </div>
  )
}

export default App

