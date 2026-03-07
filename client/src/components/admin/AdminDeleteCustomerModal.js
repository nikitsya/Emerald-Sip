import React, {useEffect} from "react"

export const AdminDeleteCustomerModal = ({customer, isDeleting = false, error = "", onConfirm, onClose}) => {
    useEffect(() => {
        if (!customer) return undefined

        // Prevent background scrolling while the confirmation dialog is open.
        const originalBodyOverflow = document.body.style.overflow
        const originalHtmlOverflow = document.documentElement.style.overflow
        document.body.style.overflow = "hidden"
        document.documentElement.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = originalBodyOverflow
            document.documentElement.style.overflow = originalHtmlOverflow
        }
    }, [customer])

    useEffect(() => {
        if (!customer) return undefined

        const handleEscapeKey = (event) => {
            if (event.key === "Escape" && !isDeleting && typeof onClose === "function") onClose()
        }

        window.addEventListener("keydown", handleEscapeKey)
        return () => window.removeEventListener("keydown", handleEscapeKey)
    }, [customer, isDeleting, onClose])

    if (!customer) return null

    const customerName = String(customer.name || "this customer").trim() || "this customer"
    const customerEmail = String(customer.email || "").trim()
    const customerPhoto = String(customer.profilePhoto || "").trim()

    const handleOverlayClick = () => {
        if (isDeleting) return
        if (typeof onClose === "function") onClose()
    }

    const handleConfirm = () => {
        if (typeof onConfirm === "function") onConfirm(customer)
    }

    const handleCancel = () => {
        if (isDeleting) return
        if (typeof onClose === "function") onClose()
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div
                className="confirm-delete-card"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Delete customer confirmation"
            >
                <h3>Delete Customer</h3>
                <p>Are you sure you want to delete <strong>{customerName}</strong>?</p>
                {customerEmail ? <p>{customerEmail}</p> : null}
                {customerPhoto ? <img className="confirm-delete-image" src={`data:;base64,${customerPhoto}`}
                                      alt={customerName}/> : null}
                {error ? <p className="confirm-delete-error" role="alert">{error}</p> : null}

                <div className="confirm-delete-actions">
                    <button type="button" className="red-button" onClick={handleConfirm} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <button type="button" className="blue-button" onClick={handleCancel} disabled={isDeleting}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
