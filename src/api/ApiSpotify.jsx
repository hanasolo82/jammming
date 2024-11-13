import { useEffect } from "react";
import { redirectToAuthCodeFlow, getAccessToken, getSearch} from "./apiFunctions"

export default  function Api({setApiData, searchInput}, ) {
  
  var clientId = import.meta.env.VITE_API_CLIENT_ID;
  // const secretKey = import.meta.env.VITE_API_SECRET_KEY;
  
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");


  useEffect(() => {
    
    async function fetchData(searchInput) {
      var clientId = import.meta.env.VITE_API_CLIENT_ID;
      if (!code) {
        redirectToAuthCodeFlow(clientId);
        
      } else {
        // aqui se para la funcion hasta que llamamos a Api---------------y redirectToAuthCodeFlow devuelva un codigo
        console.log('code challege', code)
        const access_token = await getAccessToken(clientId, code);
        
        const search = searchInput ? await getSearch(searchInput, access_token) : []
         
        setApiData({access_token, search});
      }
    }
  
    fetchData()
  }, [clientId, code, setApiData, searchInput])	
  

}

 