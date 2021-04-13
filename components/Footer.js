import Link from 'next/link'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={ styles.footer }>
      <Link href="https://metcalffoundation.com/">
        <a target="_blank" className={ styles.link }>
          <img src="/img/metcalf-logo-blue-black.png" />
        </a>
      </Link>
      <Link href="https://torontofoundation.ca/">
        <a target="_blank" className={ styles.link }>
          <img src="/img/toronto-foundation.jpg" />
        </a>
      </Link>
      <img className={ styles.ph } src="/img/phlogosmall.jpg" width="116" height="114" />
    </footer>
  )
}
