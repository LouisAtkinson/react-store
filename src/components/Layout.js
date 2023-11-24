import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function Layout(props) {
    return (
        <div className="site-wrapper">
            <Header 
                cartItemCount={props.cartItemCount}
            />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}