import { nanoid } from 'nanoid';
 

// get redirect to aunth private items  -------------------------------------------- redirectToAuthCodeFlow
export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(10);
    
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("verifier", verifier);
    
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    
}
//------------------------------------------------------------------------------------this part will be made with nanoId
// verifier
export function generateCodeVerifier(length) {
  const model = nanoid(length)
  return model
}
// challenge
async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
// -------------------------------------------------------------------------------------getAccessToken
export async function getAccessToken(clientId, code) {
    
    const verifier = localStorage.getItem("verifier");
    if (!verifier) {
      throw new Error("No se encontró el code_verifier en localStorage.");
    }
    const params = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code", code,
      redirect_uri: "http://localhost:5173/callback",
      code_verifier: verifier
    });
  
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
  
    if (!result.ok) {
      const error = await result.json();
      if (error.error_description === "Authorization code expired") redirectToAuthCodeFlow(clientId);
      return;
    }
    
    const  {access_token}  = await result.json();
    console.log("Token obtenido:", access_token);
    console.log('clientId:', clientId)
    console.log('code:', code)
    console.log('codeverifier:', verifier)
    return access_token;
    
  }
  
//----------------------------------------------------------------------------------------getSearch
export async function getSearch({searchInput, access_token}) {
    const queryEncode = `q=${encodeURIComponent(searchInput)}&type=track&limit=3`;
    const searchUrl = "https://api.spotify.com/v1/search?";
    const completeUrl = searchUrl + queryEncode;
    
    console.log("Token usado para la solicitud:", access_token);
    try {
      const response = await fetch(completeUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.tracks.items;
      } else {
        const errorResponse = await response.text(); // Obtener el texto de la respuesta
        console.error("Error en la solicitud:", response.status, errorResponse);
    }
    } catch (error) {
      console.log(error);
    }
  }

