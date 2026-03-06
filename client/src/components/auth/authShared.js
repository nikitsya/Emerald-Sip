import {ACCESS_LEVEL_GUEST} from "../../config/global_constants"

export const AUTH_SESSION_CHANGED_EVENT = "auth-session-changed"

const notifySessionChanged = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT))
    }
}

export const hasValidToken = (tokenValue = localStorage.token) => {
    const token = String(tokenValue || "").trim()
    return Boolean(token && token !== "null" && token !== "undefined")
}

export const getStoredAccessLevel = () => {
    const accessLevel = Number(localStorage.accessLevel)
    return Number.isFinite(accessLevel) ? accessLevel : ACCESS_LEVEL_GUEST
}

// Extracts a readable error message from axios/network errors.
export const getAuthErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data
    if (typeof responseData === "string" && responseData.trim()) return responseData.trim()
    if (typeof responseData?.message === "string" && responseData.message.trim()) return responseData.message.trim()
    if (typeof error?.message === "string" && error.message.trim()) return error.message.trim()
    return fallbackMessage
}

// Persists authenticated user data used by route guards and protected requests.
export const setUserSession = ({name, accessLevel, profilePhoto, token}) => {
    localStorage.name = name
    localStorage.accessLevel = Number.isFinite(Number(accessLevel)) ? Number(accessLevel) : ACCESS_LEVEL_GUEST
    // Remove keys instead of storing "null"/"undefined" string values.
    if (profilePhoto) localStorage.profilePhoto = profilePhoto
    else localStorage.removeItem("profilePhoto")
    if (token) localStorage.token = token
    else localStorage.removeItem("token")
    notifySessionChanged()
}

// Restores guest defaults after failed auth attempts.
export const setGuestSession = () => {
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.removeItem("profilePhoto")
    localStorage.removeItem("token")
    notifySessionChanged()
}

// Clears all local session values on logout.
export const clearSession = () => {
    setGuestSession()
}
