import { nanoid } from 'nanoid';
 
//------------------------------------------------------------------------------------this part will be made with nanoId
// verifier
function generateCodeVerifier(length) {
  const model = nanoid(length)
  return model
}
// challenge
async function generateCodeChallenge(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
// get redirect to aunth private items  -------------------------------------------- redirectToAuthCodeFlow
export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(100);
    
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("verifier", verifier);
    
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email playlist-modify-public playlist-modify-private");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    
}

// -------------------------------------------------------------------------------------getAccessToken
export async function getAccessToken(clientId, code) {
    
    let verifier = localStorage.getItem("verifier");
    if (!verifier) {
      throw new Error("No se encontró el code_verifier en localStorage.");
    }
     
  
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code", 
        code,
        redirect_uri: "http://localhost:5173/callback",
        code_verifier: verifier
      })
    });
  
    if (!result.ok) {
      const error = await result.json();
      if (error.error_description === "Authorization code expired") redirectToAuthCodeFlow(clientId);
      return;
    }
    
    const  {access_token}  = await result.json();
    localStorage.setItem("access_token", access_token);
    
    return access_token;
    
  }
  
//----------------------------------------------------------------------------------------getSear

