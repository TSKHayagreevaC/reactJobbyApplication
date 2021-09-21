import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMessage: '',
    showSubmitError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccessfulLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMessage => {
    this.setState({showSubmitError: true, errorMessage})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const loginOptions = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, loginOptions)
    const data = await response.json(response)
    if (response.ok === true) {
      this.onSuccessfulLogin(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showSubmitError, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="form-bg-container">
        <form className="form" onSubmit={this.onSubmitLoginForm}>
          <img
            className="form-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label htmlFor="username" className="form-label">
            USERNAME
          </label>
          <input
            className="form-input"
            type="text"
            id="username"
            placeholder="Username"
            onChange={this.onChangeUsername}
          />
          <label htmlFor="password" className="form-label">
            PASSWORD
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            placeholder="Password"
            onChange={this.onChangePassword}
          />
          <button className="form-submit-button" type="submit">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMessage}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
