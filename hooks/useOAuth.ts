import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// 🔥 GERA O REDIRECT URI AUTOMATICAMENTE
const redirectUri = makeRedirectUri({
  scheme: "tomastudy",
  preferLocalhost: false,
  path: "redirect",
});

// ---------------- GOOGLE ---------------- //
export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "672853413390-qkk9qifkaeblqia1tj66b76ibk3im90j.apps.googleusercontent.com",
    androidClientId:
      "672853413390-qkk9qifkaeblqia1tj66b76ibk3im90j.apps.googleusercontent.com",
    iosClientId:
      "672853413390-qkk9qifkaeblqia1tj66b76ibk3im90j.apps.googleusercontent.com",
    redirectUri,
  });

  async function signIn() {
    return await promptAsync();
  }

  return { request, response, signIn };
}

// ---------------- FACEBOOK ---------------- //
export function useFacebookAuth() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "1744597469542620",
    responseType: "token",
    redirectUri, // 🔥 SEM ISSO O FACEBOOK SEMPRE DÁ ERRO
  });

  async function signIn() {
    return await promptAsync();
  }

  return { request, response, signIn };
}
