import React, { useEffect } from "react";
import { 
  redirectToAuthCodeFlow,
  getAccessToken,
  getSearch,
 } from "./apiFunctions";


export default  function Api({setApiData, searchInput}) {

  const clientId = import.meta.env.VITE_API_CLIENT_ID;
  const secretKey = import.meta.env.VITE_API_SECRET_KEY;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");


  useEffect(() => {
    console.log("Código de la URL:", code);
    async function fetchData() {
      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        // aqui se para la funcion hasta que llamamos a Api---------------y redirectToAuthCodeFlow devuelva un codigo
        
        const token = await getAccessToken(clientId, code);
        console.log("Código obtenido para el token:", code);
        console.log("Token obtenido:", );
        const search = searchInput ? await getSearch(searchInput, token) : []
         
        setApiData({token, search});
      }
    }
  
    fetchData()
  }, [token, setApiData, searchInput])	
  

}

 