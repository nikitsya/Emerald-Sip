import {useCallback, useState} from "react"

// Baseline field values shared by product create/edit screens.
const INITIAL_PRODUCT_FORM = {
    name: "",
    price: "",
    images: "",
    description: "",
    capacityMl: "",
    material: "",
    color: ""
}

// Normalizes comma-separated image input into a clean array payload.
const parseImageList = (imagesValue) => String(imagesValue || "")
    .split(`,`)
    .map((value) => value.trim())
    .filter((value) => value !== ``)

// Converts API product response into form-friendly string values.
export const mapProductToFormValues = (product = {}) => ({
    name: product.name || product.product || "",
    price: product.price ?? "",
    images: Array.isArray(product.images) ? product.images.join(`, `) : "",
    description: product.description || "",
    capacityMl: product.capacityMl ?? "",
    material: product.material || "",
    color: product.color || ""
})

// Validates product form fields before API submission.
export const validateProductForm = (formValues = {}) => {
    const errors = {}
    const name = String(formValues.name || "").trim()
    const priceText = String(formValues.price ?? "").trim()
    const capacityText = String(formValues.capacityMl ?? "").trim()
    const images = parseImageList(formValues.images)

    // Name is required by product schema and must not be blank.
    if (!name) errors.name = "Name is required"

    // Price must be present, numeric, and non-negative.
    if (!priceText) errors.price = "Price is required"
    else if (!Number.isFinite(Number(priceText))) errors.price = "Price must be a valid number"
    else if (Number(priceText) < 0) errors.price = "Price cannot be negative"

    // Product creation/edit requires at least one image URL/path.
    if (images.length === 0) errors.images = "At least one image is required"

    // Capacity is optional, but when provided it must be a whole non-negative number.
    if (capacityText !== "") {
        if (!Number.isFinite(Number(capacityText))) errors.capacityMl = "Capacity must be a valid number"
        else if (!Number.isInteger(Number(capacityText))) errors.capacityMl = "Capacity must be a whole number"
        else if (Number(capacityText) < 0) errors.capacityMl = "Capacity cannot be negative"
    }

    return errors
}

// Converts form state back into normalized payload expected by backend routes.
export const buildProductPayload = (formValues) => ({
    name: String(formValues.name || "").trim(),
    price: Number(formValues.price),
    images: parseImageList(formValues.images),
    description: String(formValues.description || "").trim(),
    capacityMl: formValues.capacityMl === `` ? undefined : Number(formValues.capacityMl),
    material: String(formValues.material || "").trim(),
    color: String(formValues.color || "").trim()
})

export const useProductForm = (initialValues = INITIAL_PRODUCT_FORM) => {
    const [formValues, setFormValues] = useState({
        ...INITIAL_PRODUCT_FORM,
        ...initialValues
    })

    // Returns stable change handlers for individual form fields.
    const updateField = useCallback((fieldName) => (event) => {
        const {value} = event.target
        setFormValues((previousValues) => ({
            ...previousValues,
            [fieldName]: value
        }))
    }, [])

    // Replaces all fields at once (useful when preloading Edit form data).
    const replaceFormValues = useCallback((nextValues = {}) => {
        setFormValues({
            ...INITIAL_PRODUCT_FORM,
            ...nextValues
        })
    }, [])

    return {
        formValues,
        updateField,
        replaceFormValues
    }
}
