import React,{useState} from "react";


export default function searchResults({tracksResults}) {

    return (
    <div className='results-container'>
            <h2 className='results-title'>Results</h2>
                {tracksResults}
          </div>
    )       
}