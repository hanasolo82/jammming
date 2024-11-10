import React from "react";

export default function Track({ name, artists, album, handleAddTrack, isAdded, handleSusTrack}) {
const maxLetters = 10
const artistName = artists?.[0].name;
const artistNameSlice = artistName ? artistName.length > maxLetters 
? artistName.slice(0, maxLetters) + "..."
: artistName : "Not Adviable Artist";
const myImage = "public\dario-veronesi-_mEZtQzcpTA-unsplash.jpg";
const imageUrl =  album?.images[0]?.url ? album?.images[0]?.url :  myImage;
const trackName = name
? name.length > maxLetters 
? name.slice(0, maxLetters) + "..."
: name : "Not Adviable Artist";
 
    return (
        <div className='track-container'>
              <img className='track-image' src={imageUrl}/>
              <div className='track-text'>
                <h3 className='track-artists' title={artistName}>{artistNameSlice}</h3>
                <h4 className='track' title={name}>{trackName}</h4>
              </div>
              {!isAdded ?
              <button 
              className='track-btn' 
              onClick={() => handleAddTrack({name, artists, album })}
              >
                +
                
              </button>
              :  
              <button 
              className='track-btn' 
              onClick={() => handleSusTrack({name, artists, album })}
              >
                -
                
              </button>
            }
              
        </div>
    )
}