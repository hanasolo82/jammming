import { useState } from 'react'
import SearchBar from './components/SearchBar';
import Track from './components/Track';
import SearchResults from './components/SearchResults';
import Playlist from "./components/Playlist";
import Api from './api/ApiSpotify';

export default function App() {

// -----------------------------------------------------------------States

const [searchInput, setSearchInput] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [isClicked, setIsClicked] = useState(false);
const [sendList, setSendList] = useState(false);
const [tracklist, setTracklist] = useState([]);
const [playlist, setPlaylist] = useState({
      "name": "Playlist",
      "description": "Playlist created by me whith my own App",
      "public": false,
})
function handleIsClicked() {
  setIsClicked(prevClicked => !prevClicked )
}
// ------------envio de lista de canciones a spotify----------------------------------------

function handleSendList() {
  setSendList(prevSet => !prevSet)
  
}
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
 //---------------------------------trackUri------------------- 
const tracksUri = tracklist.map(item => `spotify:track:${item.id}`) 
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
      setSearchResult={setSearchResult}
      searchInput={searchInput}
      isClicked={isClicked}
      sendList={sendList}
      playlist={playlist}
      tracksUri={tracksUri}
       />
      <header className='header'>
        <h1>Jammming</h1>
        <SearchBar 
              inputName='input'
              typeInput='text'
              value={searchInput}
              onChangeInput={handleChange}
              handleIsClicked={handleIsClicked}
              
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
            handleSendList={handleSendList}
            
            />
        </section>
    </div>
  )
}


