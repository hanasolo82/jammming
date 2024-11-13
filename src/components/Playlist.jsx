import React from 'react';


export default function Playlist ({ value, onChange, tracks, playListName, name, createPlaylist}) {

    return (
        <div className='playlist-container'>
            <h2>{playListName}</h2>
            <input
                className='playlist-input' 
                onChange={onChange}
                value={value}
                name={name}

                />
            <button className='create-btn'onClick={createPlaylist}>Create List</button>
            {tracks}  
          </div>
    )
}