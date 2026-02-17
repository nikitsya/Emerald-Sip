import React from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
    return (
        <nav className="top-nav">
            <Link to="/" className="top-nav-link">Каталог</Link>
            <Link to="/AddProduct" className="top-nav-link">Добавить</Link>
            <Link to="/DisplayAllProducts" className="top-nav-link">Все товары</Link>
        </nav>
    );
};
