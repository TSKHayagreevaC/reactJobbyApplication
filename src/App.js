import {Route, Switch, Redirect} from 'react-router-dom'

import './App.css'

import AuthenticatedRoute from './components/authenticatedRoute'
import Header from './components/headerSection'
import LoginForm from './components/loginForm'
import Home from './components/home'
import AllJobs from './components/allJobs'
import EachJobDetails from './components/eachJobDetails'
import NotFoundRoute from './components/notFoundRoute'

const App = () => (
  <>
    <Header />
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <AuthenticatedRoute exact path="/" component={Home} />
      <AuthenticatedRoute exact path="/jobs" component={AllJobs} />
      <AuthenticatedRoute exact path="/jobs/:id" component={EachJobDetails} />
      <Route path="/not-found" component={NotFoundRoute} />
      <Redirect to="not-found" />
    </Switch>
  </>
)

export default App
