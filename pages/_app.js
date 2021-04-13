import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

import '@styles/globals.css'

function Application({ Component, pageProps }) {
  return (
    <div className="container">
      <Head>
        <title>TANGO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <Component {...pageProps} />

      <Footer />
    </div>
  )
}

export default Application
