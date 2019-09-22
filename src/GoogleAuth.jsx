import React, { useEffect, useMemo, useState } from "react"
import { GOOGLE_API_APIKEY, GOOGLE_API_CLIENT_ID } from "./credentials"
import { useScript } from "./hooks"
import Button from "components/_ui/Button/Button"

const scopes = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
].join(" ")

const googleAuthContext = React.createContext({
  events: [],
  email: null,
})
export { googleAuthContext }

const GoogleAuth = ({ children }) => {
  const [hasLoadedGapi] = useScript(
    "https://apis.google.com/js/api.js"
  )
  const [email, setEmail] = useState(null)
  const [token, setToken] = useState(null)
  const [auth, setAuth] = useState(null)
  const [events, setEvents] = useState([])

  const onAuthChange = () => {
    if (!auth) return
    const user = auth.currentUser.get()
    const isSignedIn = user.isSignedIn()
    if (isSignedIn) {
      const email = user.w3.U3
      const token = user.getAuthResponse().id_token
      setEmail(email)
      setToken(token)
      getEvents()
    } else {
      setEmail(null)
    }
  }

  useEffect(() => {
    if (!auth) return
    onAuthChange()
    auth.currentUser.listen(onAuthChange)
  }, [auth])

  const initClient = async () => {
    window.gapi.client.init({
      "apiKey": GOOGLE_API_APIKEY,
      "clientId": GOOGLE_API_CLIENT_ID,
      "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      "scope": scopes
    }).then(() => {
      const auth = window.gapi.auth2.getAuthInstance()
      setAuth(auth)
    })
  }

  const initAuth = async () => {
    if (!window.gapi) {
      console.error("no window.gapi")
      return
    }
    window.gapi.load('client:auth2', initClient)
  }

  useEffect(() => {
    if (!hasLoadedGapi) return
    initAuth()
  }, [hasLoadedGapi])

  const onInitAuth = () => {
    if (!auth) return
    auth.signIn()
  }

  const getEvents = () => {
    if (!window.gapi || !window.gapi.client.calendar) return
    window.gapi.client.calendar.events.list({
      "calendarId": "primary",
      "timeMin": (new Date()).toISOString(),
      "showDeleted": false,
      "singleEvents": true,
      "maxResults": 30,
      "orderBy": "startTime"
    }).then(function(response) {
      setEvents(response.result.items || [])
    })
  }

  const onLogout = () => {
    if (!auth) return
    auth.signOut()
    onAuthChange()
  }

  const contextValue = useMemo(() => ({
    events: events || [],
    email,
    token,
  }), [events, email, token])

  if (!auth) return (
    <div>
      Loading...
    </div>
  )

  if (!email) return (
    <>
      <Button onClick={onInitAuth}>
        Sign in
      </Button>
    </>
  )

  return (
    <>
      <Button onClick={onLogout} style={{marginRight: "auto"}} styleType="link">
        Log out
      </Button>

      <googleAuthContext.Provider value={contextValue}>
        { children }
      </googleAuthContext.Provider>
    </>
  )
}

export default GoogleAuth