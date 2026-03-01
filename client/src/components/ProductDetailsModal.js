import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {ACCESS_LEVEL_ADMIN} from "../config/global_constants"

const formatPrice = (value) => `€ ${(Number(value) || 0).toFixed(2)}`

export const ProductDetailsModal = ({product, onClose, onAddToCart, isInCart = false}) => {
    useEffect(() => {
        if (!product) {
            return
        }

        const originalBodyOverflow = document.body.style.overflow
        const originalHtmlOverflow = document.documentElement.style.overflow

        document.body.style.overflow = "hidden"
        document.documentElement.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = originalBodyOverflow
            document.documentElement.style.overflow = originalHtmlOverflow
        }
    }, [product])

    if (!product) return null;

    const images = Array.isArray(product.images) ? product.images : []
    const primaryImage = images.length > 0 ? images[0] : ""
    const additionalImages = images.slice(1)
    const capacityValue = product.capacityMl === null || typeof product.capacityMl === "undefined" ? "-" : `${product.capacityMl} ml`
    const isAdmin = Number(localStorage.accessLevel) >= ACCESS_LEVEL_ADMIN
    const canAddToCart = typeof onAddToCart === "function"
    const handleAddToCart = () => {
        if (canAddToCart) {
            onAddToCart(product);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
                 aria-label={product.name}>
                <div className="modal-hero">
                    {primaryImage ? (
                        <img className="modal-hero-image" src={primaryImage} alt={product.name}/>
                    ) : (
                        <div className="modal-hero-empty">No image available</div>
                    )}
                </div>

                <div className="modal-content">
                    <div className="modal-header">
                        <h3>{product.name}</h3>
                        <button type="button" className="blue-button modal-close-btn" onClick={onClose}>Close</button>
                    </div>

                    <div className="modal-stats">
                        <span className="modal-stat">{formatPrice(product.price)}</span>
                        <span className="modal-stat">{capacityValue}</span>
                        <span className="modal-stat">{product.material || "-"}</span>
                        <span className="modal-stat">{product.color || "-"}</span>
                    </div>

                    <p className="modal-description">{product.description || "-"}</p>

                    {additionalImages.length > 0 ? (
                        <div className="modal-images">
                            {additionalImages.map((src, i) => (
                                <img key={i} className="modal-thumb" src={src} alt={`${product.name}-extra-${i + 1}`}/>
                            ))}
                        </div>
                    ) : null}

                    <div className="modal-actions">
                        {canAddToCart ? (
                            <button
                                type="button"
                                className="icon-button add-to-cart-icon-button"
                                onClick={handleAddToCart}
                                aria-label={isInCart ? "Added to Cart" : "Add to Cart"}
                                title={isInCart ? "Added to Cart" : "Add to Cart"}
                            >
                                <img
                                    className="add-to-cart-icon"
                                    src={isInCart ? "/images/buttons/added_to_cart.png" : "/images/buttons/add-to-cart.png"}
                                    alt={isInCart ? "Added to Cart" : "Add to Cart"}
                                />
                            </button>
                        ) : null}
                        {isAdmin ? <Link className="green-button" to={"/EditProduct/" + product._id}>Edit</Link> : null}
                        {isAdmin ?
                            <Link className="red-button" to={"/DeleteProduct/" + product._id}>Delete</Link> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
