import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import logo from '../img/logo.svg'

const links = [
  { label: "Atlas", path: "/" },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Data", path: "/data" },
  { label: "Contact", path: "/contact" }
]

const Navbar = () => {
  const [ active, setActive ] = useState(false)
  const [ pathname, setPathname ] = useState()
  const navBarActiveClass = active ? "is-active" : ""
  
  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])

  const toggleHamburger = () => {
    setActive(!active)
  }

  return (
    <nav
      className="navbar is-transparent"
      role="navigation"
      aria-label="main-navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item logo" title="Logo">
            <img src={logo} alt="TANGO — Toronto Atlas of Neighbourhood Groups and Organisations" />
          </Link>
          {/* Hamburger menu */}
          <div
            className={`navbar-burger burger ${navBarActiveClass}`}
            data-target="navMenu"
            onClick={toggleHamburger}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div
          id="navMenu"
          className={`navbar-menu ${navBarActiveClass}`}
        >
          { links.map(({ label, path }, i) => (
            <Link
              className={`navbar-item ${path === pathname ? "selected" : ""}`}
              to={ path }
              key={ i }
            >
              { label }
            </Link>
          )) }
        </div>
      </div>
    </nav>
  )
}

export default Navbar
