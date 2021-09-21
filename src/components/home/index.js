import {Link} from 'react-router-dom'

import './index.css'

const Home = () => (
  <div className="home-bg-container">
    <h1 className="home-heading">Find The Job That Fits Your Life</h1>
    <p className="home-text">
      Millions of people are searching for jobs, salary information, company
      reviews. Find the job that fits your abilities and potential.
    </p>
    <Link to="/jobs">
      <button className="home-find-jobs-button" type="button">
        Find Jobs
      </button>
    </Link>
  </div>
)

export default Home
