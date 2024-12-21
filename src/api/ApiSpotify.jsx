import { useEffect } from "react";
import { redirectToAuthCodeFlow, getAccessToken } from "./apiFunctions";

export default function Api({ setSearchResult, searchInput, isClicked, sendList, playlist, tracksUri}) {
  var clientId = import.meta.env.VITE_API_CLIENT_ID;
  // const secretKey = import.meta.env.VITE_API_SECRET_KEY;

  const params = new URLSearchParams(window.location.search);
  let code = params.get("code");

  useEffect(() => {
    async function fetchData() {
      var clientId = import.meta.env.VITE_API_CLIENT_ID;
      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        // aqui se para la funcion hasta que llamamos a Api---------------y redirectToAuthCodeFlow devuelva un codigo
        
        const access_token = await getAccessToken(clientId, code);
        return access_token
      }
    }

    fetchData();
  }, [clientId, code]);
// ---------------------------------------------------llamamos a getsearch solo cuando isClicked cambia
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getSearch(searchInput, setSearchResult, token);
    }
  }, [isClicked]);

// funcion socicitud y almacenamiento de datos de la api---- a traves de lo que ponemos en input
  async function getSearch(searchInput) {
    const queryEncode = `q=${encodeURIComponent(
      searchInput
    )}&type=track&limit=10`;
    const searchUrl = "https://api.spotify.com/v1/search?";
    const completeUrl = searchUrl + queryEncode;
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(completeUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setSearchResult(jsonResponse.tracks.items);
      } else {
        const errorResponse = await response.text(); // Obtener el texto de la respuesta
        console.error(
          "Error en la solicitud:",
          response.status,
          errorResponse
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  //----------------------------------------------------------------------Create a list
    const token = localStorage.getItem("access_token");
    console.log(tracksUri)
    async function fetchWebApi(endpoint, method, body) {
      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method,
        body:JSON.stringify(body)
      });
      return await res.json();
    }
    async function createPlaylist(tracksUri, playlist){
      const { id: user_id } = await fetchWebApi('v1/me', 'GET')
    
      const playlistfetch = await fetchWebApi(
        `v1/users/${user_id}/playlists`, 'POST', {
          ...playlist
      })
      if ( playlistfetch.id === null){
          console.log("select something")
      }else {
        await fetchWebApi(
          `v1/playlists/${playlistfetch.id}/tracks?uris=${tracksUri.join(',')}`,
          'POST'
        );
      }
     
      
      return playlistfetch;
      
    }
    useEffect(() => {
      if(sendList && tracksUri.length > 0) {
        createPlaylist(tracksUri, playlist);
      }
      
      
    }, [sendList])
    
    
  };
  
  
  
  