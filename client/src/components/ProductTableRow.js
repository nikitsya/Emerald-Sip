import React from "react"
import {Link} from "react-router-dom"


export const ProductTableRow = props => {
    const images = Array.isArray(props.product.images) ? props.product.images : []
    const firstImage = images.length > 0 ? images[0] : ""

    return (
        <tr>
            <td>{props.product.name}</td>
            <td>{props.product.price}</td>
            <td>{firstImage ? <img className="product-thumb" src={firstImage} alt={props.product.name} /> : "-"}</td>
            <td>{props.product.description || "-"}</td>
            <td>{props.product.capacityMl ?? "-"}</td>
            <td>{props.product.material || "-"}</td>
            <td>{props.product.color || "-"}</td>
            <td>
                <Link className="green-button" to={"/EditProduct/" + props.product._id}>Edit</Link>
                <Link className="red-button" to={"/DeleteProduct/" + props.product._id}>Delete</Link>
            </td>
        </tr>
    )
}
