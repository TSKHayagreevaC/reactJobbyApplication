import {Link, withRouter} from 'react-router-dom'
import {BsFillHouseFill, BsBriefcaseFill, BsBoxArrowRight} from 'react-icons/bs'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="header-bg-nav">
      <Link className="header-link" to="/">
        <img
          className="header-image"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="links-container-large">
        <Link className="header-link" to="/">
          <li className="home-link-text">Home</li>
        </Link>
        <Link className="header-link" to="/jobs">
          <li className="jobs-text">Jobs</li>
        </Link>
      </ul>
      <button
        className="header-logout-button-large"
        type="button"
        onClick={onClickLogout}
      >
        Logout
      </button>
      <ul className="links-container-small">
        <li className="links-list-item">
          <Link to="/" className="header-link">
            <BsFillHouseFill className="header-react-icon" />
          </Link>
        </li>
        <li className="links-list-item">
          <Link to="/jobs" className="header-link">
            <BsBriefcaseFill className="header-react-icon" />
          </Link>
        </li>
        <li className="links-list-item">
          <button
            className="header-logout-button-small"
            type="button"
            onClick={onClickLogout}
          >
            <BsBoxArrowRight className="header-react-icon" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
