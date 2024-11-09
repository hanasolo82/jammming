import React from 'react';


export default function Tracklist ({tracks}) {

    return (
        <div className='track-list-container'>
            <h2 className='track-title'>Tracklist</h2>
            {tracks}  
          </div>
    )
}