import { useEffect } from "react";

// get redirect to aunth private items  -------------------------------------------- redirectToAuthCodeFlow
export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(155);
    const challenge = await generateCodeChallenge(verifier);

    localStorage?.setItem("verifier", verifier);
  
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
function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply([null, ...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
// -------------------------------------------------------------------------------------getAccessToken
export async function getAccessToken(clientId, code) {
    
    const verifier = localStorage.getItem("verifier");
    
  
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
  
   /* if (!result.ok) {
      const error = await result.json();
      if (error.error === "invalid_grant") redirectToAuthCodeFlow(clientId);
      throw new Error(error.error_description || "Error en la solicitud de token");
    }*/
  
    const { access_token } = await result.json();
    console.log("Token obtenido:", access_token);
    return access_token;
  }
  
//----------------------------------------------------------------------------------------getSearch
export async function getSearch({searchInput, token}) {
    const queryEncode = `q=${encodeURIComponent(searchInput)}&type=track&limit=3`;
    const searchUrl = "https://api.spotify.com/v1/search?";
    const completeUrl = searchUrl + queryEncode;
    const accessToken = token;
    console.log("Token usado para la solicitud:", accessToken);
    try {
      const response = await fetch(completeUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
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