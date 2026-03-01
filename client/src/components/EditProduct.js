import React, {useEffect, useState} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
import {ACCESS_LEVEL_CUSTOMER, SERVER_HOST} from "../config/global_constants"
import {buildProductPayload, mapProductToFormValues, useProductForm} from "../hooks/useProductForm"
import {ProductFormFields} from "./ProductFormFields"

export const EditProduct = props => {
    const {formValues, updateField, replaceFormValues} = useProductForm()
    const [redirectToDisplayAllProducts, setRedirectToDisplayAllProducts] = useState(localStorage.accessLevel < ACCESS_LEVEL_CUSTOMER)


    useEffect(() => {
        //axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/products/${props.match.params.id}`, {headers: {"authorization": localStorage.token}})
            .then((res) => {
                replaceFormValues(mapProductToFormValues(res.data))
            })
            .catch(err => console.log(`${err.response.data}\n${err}`))
    }, [props.match.params.id, replaceFormValues])

    const handleSubmit = e => {
        e.preventDefault()

        const productObject = buildProductPayload(formValues)

        //axios.defaults.withCredentials = true // needed for sessions to work
        axios.put(`${SERVER_HOST}/products/${props.match.params.id}`, productObject, {headers: {"authorization": localStorage.token}})
            .then(() => {
                setRedirectToDisplayAllProducts(true)
            })
            .catch(err => console.log(`${err.response.data}\n${err}`))
    }

    return (
        <div className="form-container">{redirectToDisplayAllProducts ? <Redirect to="/DisplayAllProducts"/> : null}
            <ProductFormFields
                formValues={formValues}
                onFieldChange={updateField}
                submitLabel="Update"
                onSubmit={handleSubmit}
            />
        </div>
    )
}
