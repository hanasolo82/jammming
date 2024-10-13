import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar';
import Track from './components/Track';
import data from './api/data';



export default function App() {
/* ejemplo extraccion de datos */
const url = data.album.images[0].url
const track = data.album.name
const artists = data.album.artists[0].name

  return (
    <div className='body-container'>
      <header className='header'>
        <h1>Jammming</h1>
        <SearchBar />
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


