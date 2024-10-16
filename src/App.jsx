import React,{ useState, useEffect } from 'react'
import './App.css'
import SearchBar from './components/SearchBar';
import Track from './components/Track';
import data from './api/data';



export default function App() {
/* ejemplo extraccion de datos */
const url = data.album.images[0].url
const track = data.album.name
const artists = data.album.artists[0].name

const [accessToken, setAccessToken] = useState("");
const [searchInput, setSearchInput] = useState("");
const [searchResult, setSearchResult] = useState([]);

const tokenURL = "https://accounts.spotify.com/api/token";
const clientId = import.meta.env.VITE_API_CLIENT_ID;
const secretKey = import.meta.env.VITE_API_SECRET_KEY;
const credentials = btoa(`${clientId}:${secretKey}`);


//solicitud del token
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

//solicitud de datos de input search
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
console.log("Valor de searchInput:", searchInput);
/*Search bar props and states */
function handleChange(e) {
  setSearchInput(e.target.value)
}
console.log(searchResult)

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
      <div className='main-container '>
          <div className='results-container'>
            <h2 className='results-title'>Results</h2>
              <Track />
          </div>
          <div className='track-list-container'>
          <h2>Tracklist</h2>
              <Track />
          </div>
           
        </div>
    </div>
  )
}


