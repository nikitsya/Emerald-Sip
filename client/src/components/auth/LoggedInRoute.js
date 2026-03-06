import React from 'react'
import {Redirect, Route} from "react-router-dom"
import {ACCESS_LEVEL_GUEST} from "../../config/global_constants"
import {getStoredAccessLevel, hasValidToken} from "./authShared"


export const LoggedInRoute = ({component: Component, exact, path, ...rest}) =>
    <Route
        exact={exact}
        path={path}
        // Guard protected routes by access level and a non-empty token value.
        render={props => getStoredAccessLevel() > ACCESS_LEVEL_GUEST
            && hasValidToken()
            ? <Component {...props} {...rest} />
            : <Redirect to="/DisplayAllProducts"/>}
    />
