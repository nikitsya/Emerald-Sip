import React, {useState} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
import {Button} from "../ui/Button"
import {SERVER_HOST} from "../../config/global_constants"
import {clearSession} from "./authShared"


export const Logout = ({
                           onLoggedOut = () => {
                           }
                       }) => {
    // Component redirects after successful logout request.
    const [isLoggedIn, setIsLoggedIn] = useState(true)

    const handleSubmit = e => {
        e.preventDefault()
        // Server logout is best-effort; app auth state is controlled client-side with JWT in localStorage.
        axios.post(`${SERVER_HOST}/users/logout`)
            .catch(() => {
            })
            .finally(() => {
                // Always clear client session to avoid stale admin/customer UI after logout.
                clearSession()
                onLoggedOut()
                setIsLoggedIn(false)
            })
    }

    return (
        <div>
            {!isLoggedIn ? <Redirect to="/DisplayAllProducts"/> : null}
            <Button value="Log out" className="red-button" onClick={handleSubmit}/>
        </div>
    )
}
