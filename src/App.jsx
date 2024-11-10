import React,{ useState, useEffect } from 'react'
import {nanoid} from 'nanoid';
import SearchBar from './components/SearchBar';
import Track from './components/Track';
import data from './api/data';
import SearchResults from './components/SearchResults';
import Playlist from "./components/Playlist";


export default function App() {
/* ejemplo extraccion de datos */
const url = data.album.images[0].url
const track = data.album.name
const artists = data.album.artists[0].name
// ----------------Estados-------------------------------------------------
const [accessToken, setAccessToken] = useState("");
const [searchInput, setSearchInput] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [tracklist, setTracklist] = useState([]);
const [playlist, setPlaylist] = useState({
      "name": "Playlist",
      "description": "Playlist created by me whith my own App",
      "public": false,
})
//---------Variables-------------------------------------------------------
const tokenURL = "https://accounts.spotify.com/api/token";
const clientId = import.meta.env.VITE_API_CLIENT_ID;
const secretKey = import.meta.env.VITE_API_SECRET_KEY;
const credentials = btoa(`${clientId}:${secretKey}`);
const anas = import.meta.env.VITE_USER_ID;



//solicitud del token-----------------------------------------------------
useEffect(() => {
async function tokenAccess() {
  try {
    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.access_token);
    } else {
      console.error("Error fetching token:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
tokenAccess();  
}, [credentials]);

//solicitud de datos de input search--------------------------------------------
async function getSearch() {
  const queryEncode = `q=${encodeURIComponent(searchInput)}&type=track&limit=15`;
  const searchUrl = "https://api.spotify.com/v1/search?";
  const completeUrl = searchUrl + queryEncode;
  try {
    const response = await fetch(completeUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      setSearchResult(jsonResponse.tracks.items);
    } else {
      const errorResponse = await response.text(); // Obtener el texto de la respuesta
      console.error("Error en la solicitud:", response.status, errorResponse);
  }
  } catch (error) {
    console.log(error);
  }
}
// obtencion id---------------
async function getUserId(accessToken) {
  console.log(accessToken)
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error("Failed to fetch user ID");
    const data = await response.json();
    return data.id; // Aquí está el user_id
  } catch (error) {
    console.error("Error obteniendo el user_id:", error);
  }
}
// solicitud permiso----------------------------------------------
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}
// ------------envio de datos a spotify----------------------------------------

async function createPlaylist() {
  const tracksUri = tracklist.map(item => `spotify:track:${item.id}`)
  const playlistData = {
    name: playlist.name,
    description: playlist.description,
    public: playlist.public
  };
  try {
    const userId = await getUserId(accessToken); 
    console.log(userId)
    if (!userId) throw new Error("User ID no encontrado");
    
    const playlistArr = await fetchWebApi(`v1/users/${userId}/playlists`, 'POST', playlistData)
    const playlistId = playlistArr.id;
    await fetchWebApi(
      `v1/playlists/${playlistId}/tracks?uris=${tracksUri.join(',')}`,
      'POST'
    );
  
    return playlistArr;
  } catch (error) {alert("error en la solicitud")


  }
};
//---------manejar el cambio de nombre de la lista---------------
function handleNameChange(e) {
    const {name, value} = e.target
    setPlaylist(prevPlaylist => ({
      
        ...prevPlaylist, 
      [name]: value
      
    }))
  }
/*Search bar props and states */
function handleChange(e) {
  setSearchInput(e.target.value)
}
/**pasar objeto como una props para componente searchResults------------------- */
const tracksResults = searchResult.map(item => {
  return (
    
    <Track 
      key={item.id}
      
      {...item}
      handleAddTrack={() => handleAddTrack(item)}
    />
  )
})
const tracklistMap = tracklist.map(item => {
  return (
    <Track 
    key={item.id} 
    {...item}
    isAdded={tracklist.some(song => song.id === item.id)}
    handleSusTrack={() => handleSusTrack(item)}
     />
  )
})
  

//-------Añade a la tracklist------------------------------------
function handleAddTrack(track) {
  
  setSearchResult(oldResult => oldResult.filter(item => item.id !== track.id))
  setTracklist(oldTracklist => [...oldTracklist, track])
}
//-------Elimina de la trackList-------------------------------
function handleSusTrack(track) {
  
  setTracklist(oldTracklist => oldTracklist.filter(item => item.id !== track.id))
  setSearchResult(oldResult => [...oldResult, track])
}
  return (
    <div className='body-container'>
      <header className='header'>
        <h1>Jammming</h1>
        <SearchBar 
              inputName='input'
              typeInput='text'
              value={searchInput}
              onChangeInput={handleChange}
              onGetSearch={getSearch}
              
          />
      </header>
      <section className='main-container '>  
          <SearchResults tracksResults={tracksResults}/>
          <Playlist 
            
            tracks={tracklistMap}
            name="name"
            value={playlist.name}
            playListName={playlist.name}
            onChange={handleNameChange}
            onClick={createPlaylist} 
            />
        </section>
    </div>
  )
}


