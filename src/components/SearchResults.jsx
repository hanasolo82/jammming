import React,{useState} from "react";


export default function searchResults({results}) {

    return (
    <div className='results-container'>
            <h2 className='results-title'>Results</h2>
                {results}
          </div>
    )       
}