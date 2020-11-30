const TokenKey = 'access_token'

export function getToken(TokenKey) {
  return localStorage.getItem(TokenKey)
}

export function setToken(TokenKey,token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken(TokenKey) {
  return localStorage.removeItem(TokenKey)
}
