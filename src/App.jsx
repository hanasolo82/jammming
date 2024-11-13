import { useState } from 'react'
import SearchBar from './components/SearchBar';
import Track from './components/Track';
import SearchResults from './components/SearchResults';
import Playlist from "./components/Playlist";
import Api from './api/ApiSpotify';

export default function App() {

// -----------------------------------------------------------------States
const [apiData, setApiData] = useState({});
const [searchInput, setSearchInput] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [tracklist, setTracklist] = useState([]);
const [playlist, setPlaylist] = useState({
      "name": "Playlist",
      "description": "Playlist created by me whith my own App",
      "public": false,
})

console.log(apiData.search)



// ------------envio de lista de canciones a spotify----------------------------------------


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
      <Api 
      setApiData={setApiData}
    searchInput={searchInput}
      
    
       />
      <header className='header'>
        <h1>Jammming</h1>
        <SearchBar 
              inputName='input'
              typeInput='text'
              value={searchInput}
              onChangeInput={handleChange}
              
              
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
            
            
            />
        </section>
    </div>
  )
}


