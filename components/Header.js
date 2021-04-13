import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from './Header.module.scss'

const links = [
  { label: "Atlas", path: "/" },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Data", path: "/data" },
  { label: "Contact", path: "/contact" }
]

const Header = () => {
  const { pathname } = useRouter()

  return (
    <header className={ styles.header }>
      <Link href="/">
        <a className={ styles.logo } title="Logo">
          <img src="/img/logo.svg" alt="TANGO — Toronto Atlas of Neighbourhood Groups and Organisations" />
        </a>
      </Link>
      <nav aria-label="main-navigation">
        <div id="navMenu" className="menu">
          { links.map(({ label, path }, i) => (
            <Link key={ i } href={ path }>
              <a className={ `${styles.item} ${path === pathname ? styles.selected : ""}` }>{ label }</a>
            </Link>
          )) }
        </div>
      </nav>
    </header>
  )
}

export default Header
