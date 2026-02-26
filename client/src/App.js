import React, { useEffect, useState } from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import {DisplayAllProducts} from "./components/DisplayAllProducts"
import {AddProduct} from "./components/AddProduct"
import {EditProduct} from "./components/EditProduct"
import {DeleteProduct} from "./components/DeleteProduct"
import {ResetDatabase} from "./components/ResetDatabase"
import {Register} from "./components/Register"
import "./css/App.css"
import {Navigation} from "./components/Navigation"
import {Login} from "./components/Login"
import {ACCESS_LEVEL_GUEST} from "./config/global_constants"
import {LoggedInRoute} from "./components/LoggedInRoute"
import {ShoppingCart} from "./components/ShoppingCart"

const CART_STORAGE_KEY = "shoppingCartItems"

const readCartFromStorage = () => {
    if (typeof window === "undefined") {
        return []
    }

    try {
        const rawCart = localStorage.getItem(CART_STORAGE_KEY)
        if (!rawCart) {
            return []
        }

        const parsedCart = JSON.parse(rawCart)
        if (!Array.isArray(parsedCart)) {
            return []
        }

        return parsedCart
            .filter((item) => item && item._id)
            .map((item) => ({
                _id: item._id,
                name: item.name || "",
                price: Number(item.price) || 0,
                image: item.image || "",
                quantity: Number(item.quantity) > 0 ? Math.floor(Number(item.quantity)) : 1
            }))
    } catch {
        return []
    }
}


// Main app component with all routes
export const App = () => {
    const [searchName, setSearchName] = useState("");
    const [cartItems, setCartItems] = useState(() => readCartFromStorage())

     if (typeof sessionStorage.accessLevel === "undefined") {
        sessionStorage.name = "GUEST"
        sessionStorage.accessLevel = ACCESS_LEVEL_GUEST
    }

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    }, [cartItems])

    const handleAddToCart = (product) => {
        if (!product || !product._id) {
            return
        }

        setCartItems((previousItems) => {
            const existingItem = previousItems.find((item) => item._id === product._id)

            if (existingItem) {
                return previousItems.map((item) =>
                    item._id === product._id
                        ? {...item, quantity: item.quantity + 1}
                        : item
                )
            }

            return [
                ...previousItems,
                {
                    _id: product._id,
                    name: product.name || "",
                    price: Number(product.price) || 0,
                    image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "",
                    quantity: 1
                }
            ]
        })
    }

    const handleUpdateCartItemQuantity = (productId, nextQuantity) => {
        const normalizedQuantity = Math.floor(Number(nextQuantity))

        if (!Number.isFinite(normalizedQuantity)) {
            return
        }

        if (normalizedQuantity <= 0) {
            setCartItems((previousItems) => previousItems.filter((item) => item._id !== productId))
            return
        }

        setCartItems((previousItems) =>
            previousItems.map((item) =>
                item._id === productId
                    ? {...item, quantity: normalizedQuantity}
                    : item
            )
        )
    }

    const handleRemoveCartItem = (productId) => {
        setCartItems((previousItems) => previousItems.filter((item) => item._id !== productId))
    }

    const handleClearCart = () => {
        setCartItems([])
    }

    const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

    return (
        // BrowserRouter tracks URL changes in the browser
        <BrowserRouter>
            <Navigation
                searchName={searchName}
                setSearchName={setSearchName}
                cartItemsCount={cartItemsCount}
            />
            <Switch>
                <Route exact path="/Register" component={Register} />
                <Route exact path="/Login" component={Login} />
                <Route exact path="/ResetDatabase" component={ResetDatabase} />

                <Route
                    exact
                    path="/"
                    render={() => <DisplayAllProducts searchName={searchName} onAddToCart={handleAddToCart} />}
                />
                <Route
                    exact
                    path="/DisplayAllProducts"
                    render={() => <DisplayAllProducts searchName={searchName} onAddToCart={handleAddToCart} />}
                />
                <Route
                    exact
                    path="/Cart"
                    render={() => (
                        <ShoppingCart
                            cartItems={cartItems}
                            onUpdateQuantity={handleUpdateCartItemQuantity}
                            onRemoveItem={handleRemoveCartItem}
                            onClearCart={handleClearCart}
                        />
                    )}
                />

                
                <LoggedInRoute exact path="/AddProduct" component={AddProduct} />
                <LoggedInRoute exact path="/EditProduct/:id" component={EditProduct} />
                <LoggedInRoute exact path="/DeleteProduct/:id" component={DeleteProduct} />

                <Route render={() => <DisplayAllProducts searchName={searchName} onAddToCart={handleAddToCart} />} />
             </Switch>
        </BrowserRouter>
    )
}
