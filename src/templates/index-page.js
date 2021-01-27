import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'
import Features from '../components/Features'
import BlogRoll from '../components/BlogRoll'

import initMap from '../utilities/initMap'

if (typeof window !== 'undefined') {
  window.initMap = initMap
}

function captureClose() {
  var capture = document.getElementById("capture");
  if (capture.classList.contains("open")) {
    capture.classList.remove("open");
  }
}

export const IndexPageTemplate = ({
  image,
  title,
  heading,
  subheading,
  mainpitch,
  description,
  intro,
}) => (
  <div>
    <Helmet>
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAqfmEpJSUx1MM2ZhAhc2IHERd9npVQFUU&callback=initMap" />
    </Helmet>
    <div id="map-container">
      <div id="map"></div>
      <div id="capture">
        <div id="capture-close" onClick={ captureClose }>&times;</div>
        <div id="capture-title"></div>
        <div id="capture-content"></div>
      </div>
      <div id="toggles-container">
        <div><input id="toggle-bounds" type="checkbox" /><label>Ward Boundaries</label></div>
        <div><input id="toggle-meeting-places" type="checkbox" /><label>Public Meeting Places</label></div>
      </div>
    </div>
    <div id="legend-container">
      <div className="legend-col legend-col-1">
        <div className="legend-header">Community Organizations</div>
        <div className="legend-item">
          <span className="legend-item-symbol"><div className="square red-square"></div></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Members of <a href="https://fontra.com/" target="_blank">FONTRA</a></span>
          <div className="legend-notes-label">Federation of North Toronto Residents' Assocations</div>
        </div>
        <div className="legend-item">
          <span className="legend-item-symbol"><div className="square purple-square"></div></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Members of the GBNA</span>
          <div className="legend-notes-label">Greater Beach Neighbourhood Association</div>
        </div>
        <div className="legend-item">
          <span className="legend-item-symbol"><div className="square green-square"></div></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Members of the <a href="https://ossingtoncommunity.wordpress.com/westsidecc/" target="_new">West Side CC</a></span>
          <div className="legend-notes-label">West Side Community Council</div>
        </div>
        <div className="legend-item">
          <span className="legend-item-symbol"><div className="square yellow-square"></div></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Members of CORRA</span>
          <div className="legend-notes-label">Confederation of Resident and Ratepayer Associations</div>
        </div>
        <div className="legend-item">
          <span className="legend-item-symbol"><div className="square orange-square"></div></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Members of CANS</span>
          <div className="legend-notes-label">Community Associations of North Scarborough</div>
        </div>
        <div className="legend-item">
          <span className="legend-item-symbol"><div className="square grey-square"></div></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Organization appears to be inactive</span>
        </div>
      </div>
      <div className="legend-col legend-col-2">
        <div className="legend-header">Boundaries</div>
        <div className="legend-item">
          <span className="legend-item-symbol"><div className="square red-square empty"></div></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Toronto Municipal Ward Boundaries</span>
        </div>
        <div className="legend-header">Meeting Places</div>
        <div className="legend-item">
          <span className="legend-item-symbol"><img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" /></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Toronto Public Libraries</span>
        </div>
        <div className="legend-item">
          <span className="legend-item-symbol"><img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" /></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Toronto Public Schools</span>
        </div>
        <div className="legend-item">
          <span className="legend-item-symbol"><img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" /></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Community Centres</span>
        </div>
        <div className="legend-item">
          <span className="legend-item-symbol"><img src="http://maps.google.com/mapfiles/ms/icons/purple-dot.png" /></span>
          <span className="legend-item-break"></span>
          <span className="legend-item-label">Toronto Civic Centres</span>
        </div>
      </div>
    </div>
    <div id="footer-container">
      <div id="footer-content">
          <p><strong>Want to get involved with your neighbourhood? Check the TANGO map to see if your community has a local residents' association. If not, you can start one up!</strong></p>
          <p>Project Managers: Dave Meslin and Zahra Ebrahim</p>
          <p>Technology Lead: <a href="https://twitter.com/zolamcadie" target="_blank">Zola McAdie</a></p>
          <p>Please send comments, suggestions and corrections to <a href="mailto:dave@pigeonhat.ca">dave@pigeonhat.ca</a></p>
          <p>This map was originally created by <a href="https://twitter.com/dtopping" target="_blank">David Topping</a> in 2011</p>
      </div>
      <div id="footer-logos">
        <a href="https://metcalffoundation.com/" target="_blank" className="logo-link"><img src="/img/metcalf-logo-blue-black.png" /></a>
        <a href="https://torontofoundation.ca/" target="_blank" className="logo-link"><img src="/img/toronto-foundation.jpg" /></a>
        <img src="/img/phlogosmall.jpg" width="116" height="114" />
      </div>
    </div>
  </div>
)

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  mainpitch: PropTypes.object,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
}

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        mainpitch={frontmatter.mainpitch}
        description={frontmatter.description}
        intro={frontmatter.intro}
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        heading
        subheading
        mainpitch {
          title
          description
        }
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 240, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          heading
          description
        }
      }
    }
  }
`
