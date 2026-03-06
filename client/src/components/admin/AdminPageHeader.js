import React from "react"
import {Link} from "react-router-dom"

// Shared header for admin pages with a title and a catalog back link.
export const AdminPageHeader = ({title, backTo = "/DisplayAllProducts", backLabel = "Back to catalog"}) => (
    <div className="admin-stock-header">
        <h2>{title}</h2>
        <Link className="blue-button" to={backTo}>{backLabel}</Link>
    </div>
)
