import React, { useState, useEffect } from "react";

export default function InformationCalls() {
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

  
//solicitud de datos introducidos en input search
  async function getSearch() {
    const queryEncode = `?q=${encodeURIComponent(searchInput)}&type=track&limit=15`;
    const searchUrl = "https://api.spotify.com/v1/search";
    const completeUrl = searchUrl + queryEncode;
    try {
      const response = await fetch(completeUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setSearchResult(jsonResponse.tracks.items);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      {/*searchBar */}
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      ></input>
      <button onClick={getSearch}>buscar</button>

      {/*results */}
      <div>
        {searchResult.map((item) => (
          <div key={item.id}>
            <p>Album: {item.album.name}</p>
            <p>{item.name} de  {item.artists.map(artist => artist.name).join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
