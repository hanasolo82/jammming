import React from "react";

export default function Track({ name, artists, album, addToTrackList}) {
const maxLetters = 14  
const artistName = artists?.[0].name;
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
                <h3 className='track' title={name}>{trackName}</h3>
                <h4 className='track-artists'>{artistName}</h4>
              </div>
              <button className='track-btn' onClick={() => addToTrackList({name, artists, album })}>+</button>
        </div>
    )
}