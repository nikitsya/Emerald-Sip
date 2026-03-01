import React, {useEffect, useState} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
import {ACCESS_LEVEL_CUSTOMER, SERVER_HOST} from "../config/global_constants"
import {buildProductPayload, mapProductToFormValues, useProductForm, validateProductForm} from "../hooks/useProductForm"
import {ProductFormFields} from "./ProductFormFields"

export const EditProduct = props => {
    // Shared form hook avoids duplicated handlers across Add/Edit product pages.
    const {formValues, updateField, replaceFormValues} = useProductForm()
    // Preserve existing route guard behavior for unauthorized users.
    const [redirectToDisplayAllProducts, setRedirectToDisplayAllProducts] = useState(localStorage.accessLevel < ACCESS_LEVEL_CUSTOMER)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState("")

    // Reuse base field updater and clear stale errors for edited field.
    const handleFieldChange = (fieldName) => (event) => {
        updateField(fieldName)(event)
        setErrors((previousErrors) => ({...previousErrors, [fieldName]: ""}))
        setServerError("")
    }

    useEffect(() => {
        //axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/products/${props.match.params.id}`, {headers: {"authorization": localStorage.token}})
            .then((res) => {
                // Map API product shape to editable text field values.
                replaceFormValues(mapProductToFormValues(res.data))
            })
            .catch(err => setServerError(err?.response?.data || "Unable to load product"))
    }, [props.match.params.id, replaceFormValues])

    const handleSubmit = e => {
        e.preventDefault()
        setServerError("")

        // Block submit until local validation passes.
        const nextErrors = validateProductForm(formValues)
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        // Normalize and sanitize data before sending update request.
        const productObject = buildProductPayload(formValues)

        //axios.defaults.withCredentials = true // needed for sessions to work
        axios.put(`${SERVER_HOST}/products/${props.match.params.id}`, productObject, {headers: {"authorization": localStorage.token}})
            .then(() => {
                setRedirectToDisplayAllProducts(true)
            })
            .catch(err => setServerError(err?.response?.data || "Unable to update product"))
    }

    return (
        <div className="form-container">{redirectToDisplayAllProducts ? <Redirect to="/DisplayAllProducts"/> : null}
            <ProductFormFields
                formValues={formValues}
                onFieldChange={handleFieldChange}
                submitLabel="Update"
                onSubmit={handleSubmit}
                errors={errors}
                serverError={serverError}
            />
        </div>
    )
}
