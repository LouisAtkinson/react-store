import React from "react"
import { NavLink } from "react-router-dom"
import {ReactComponent as ReactLogo} from '../logo.svg';

export default function Header() {
    const activeStyle = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#007bff"
    }
    
    return (
        <header className='navBar'>
            <div className='logo'> 
                <ReactLogo className='logoImg'/>
                <h1>React Store</h1>
            </div>
            <nav className='links'>
                <NavLink 
                    to="/"
                    style={({isActive}) => isActive ? activeStyle : null}
                >Home</NavLink>
                <NavLink 
                    to="/store"
                    style={({isActive}) => isActive ? activeStyle : null}
                >Store</NavLink>
                <NavLink 
                    to="/cart"
                    style={({isActive}) => isActive ? activeStyle : null}
                >Cart</NavLink>
            </nav>
        </header>
    )
}