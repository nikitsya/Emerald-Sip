import React, {useState} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
import {ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"
import {buildProductPayload, useProductForm, validateProductForm} from "../hooks/useProductForm"
import {ProductFormFields} from "./ProductFormFields"


export const AddProduct = () => {
    // Reuse shared product-form state logic to keep Add/Edit behavior consistent.
    const {formValues, updateField} = useProductForm()
    // Non-admin users are redirected away from product creation page.
    const [redirectToDisplayAllProducts, setRedirectToDisplayAllProducts] = useState(localStorage.accessLevel < ACCESS_LEVEL_ADMIN)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState("")

    // Reuse base field updater and clear stale errors for edited field.
    const handleFieldChange = (fieldName) => (event) => {
        updateField(fieldName)(event)
        setErrors((previousErrors) => ({...previousErrors, [fieldName]: ""}))
        setServerError("")
    }

    const handleSubmit = e => {
        e.preventDefault()
        setServerError("")

        // Block submit until local validation passes.
        const nextErrors = validateProductForm(formValues)
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        // Build normalized API payload from UI form values.
        const productObject = buildProductPayload(formValues)

        //axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/products`, productObject, {headers: {"authorization": localStorage.token}})
            .then(() => setRedirectToDisplayAllProducts(true))
            .catch(err => setServerError(err?.response?.data || "Unable to add product"))
    }

    return (
        <div className="form-container">{redirectToDisplayAllProducts ? <Redirect to="/DisplayAllProducts"/> : null}
            <ProductFormFields
                formValues={formValues}
                onFieldChange={handleFieldChange}
                submitLabel="Add"
                onSubmit={handleSubmit}
                errors={errors}
                serverError={serverError}
            />
        </div>
    )
}
