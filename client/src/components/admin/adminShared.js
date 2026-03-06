// Shared API error-to-message mapping for admin pages.
export const getAdminErrorMessage = (error, fallbackMessage, options = {}) => {
    const {notFoundMessage = ""} = options
    const status = error?.response?.status

    if (status === 401 || status === 403) return "Your admin session expired. Please log in again."
    if (status === 404 && notFoundMessage) return notFoundMessage
    if (status && status >= 500) return "Server error. Please try again in a moment."
    if (error?.code === "ERR_NETWORK") return "Cannot connect to server. Check backend connection."

    const responseData = error?.response?.data
    if (typeof responseData === "string" && responseData.trim()) return responseData.trim()
    if (typeof responseData?.message === "string" && responseData.message.trim()) return responseData.message.trim()
    if (typeof error?.message === "string" && error.message.trim()) return error.message.trim()
    return fallbackMessage
}

// Renders active direction marker for sortable table headers.
export const getSortIndicator = (sortConfig, column) => {
    if (sortConfig.column !== column) return ""
    return sortConfig.direction === "asc" ? "▲" : "▼"
}
