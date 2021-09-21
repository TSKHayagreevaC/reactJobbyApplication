import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {
  BsStarFill,
  BsBriefcaseFill,
  BsGeoAlt,
  BsBoxArrowUpRight,
} from 'react-icons/bs'

import './index.css'

const apiValueConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class EachJobDetails extends Component {
  state = {
    clickedJobDetails: {},
    skillsList: [],
    lifeAtCompany: {},
    similarJobsList: [],
    jobApiStatus: apiValueConstants.initial,
  }

  componentDidMount() {
    this.getUniqueJobDetails()
  }

  getFormattedJobDetails = data => ({
    id: data.id,
    title: data.title,
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    companyWebSiteUrl: data.company_website_url,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
  })

  getUniqueJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const uniqueJobUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    this.setState({jobApiStatus: apiValueConstants.inProgress})
    const jobDetailsResponse = await fetch(uniqueJobUrl, options)
    if (jobDetailsResponse.ok) {
      const jobDetailsData = await jobDetailsResponse.json()
      const formattedJobData = this.getFormattedJobDetails(
        jobDetailsData.job_details,
      )
      const formattedLifeAtCompany = {
        description: jobDetailsData.job_details.life_at_company.description,
        imageUrl: jobDetailsData.job_details.life_at_company.image_url,
      }
      const formattedSkillsList = jobDetailsData.job_details.skills.map(
        eachItem => ({
          name: eachItem.name,
          imageUrl: eachItem.image_url,
        }),
      )
      const formattedSimilarJobsList = jobDetailsData.similar_jobs.map(
        eachSimilarJob => this.getFormattedJobDetails(eachSimilarJob),
      )
      this.setState({
        clickedJobDetails: formattedJobData,
        similarJobsList: formattedSimilarJobsList,
        skillsList: formattedSkillsList,
        lifeAtCompany: formattedLifeAtCompany,
        jobApiStatus: apiValueConstants.success,
      })
    } else {
      this.setState({jobApiStatus: apiValueConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getUniqueJobDetails()
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        onClick={this.onClickRetry}
        className="retry-button"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderLifeStyleContainer = () => {
    const {lifeAtCompany} = this.state

    return (
      <div className="lifestyle-container">
        <h1 className="life-at-company-heading">Life at Company</h1>
        <div className="life-style-image-description-container">
          <p className="life-style-description">{lifeAtCompany.description}</p>
          <img
            className="life-at-company-image"
            src={lifeAtCompany.imageUrl}
            alt="life at company"
          />
        </div>
      </div>
    )
  }

  renderSkillsList = () => {
    const {skillsList} = this.state
    return (
      <div className="skills-container">
        <p className="skills-heading">Skills</p>
        <div className="skills-image-text-list">
          {skillsList.map(eachItem => (
            <div className="each-skill-list-item" key={eachItem.name}>
              <div className="each-skill-container">
                <img
                  className="skill-image"
                  src={eachItem.imageUrl}
                  alt={`${eachItem.name}`}
                />
                <p className="skill-name">{eachItem.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderJobDetailsContainer = () => {
    const {clickedJobDetails} = this.state

    return (
      <div className="clicked-job-details-container">
        <div className="job-list-item">
          <div className="job-list-item-container">
            <div className="list-item-image-container">
              <img
                className="list-item-image"
                src={clickedJobDetails.companyLogoUrl}
                alt="job details company logo"
              />
              <div className="list-job-title-rating-container">
                <h1 className="job-details-title">{clickedJobDetails.title}</h1>
                <div className="start-rating-container">
                  <BsStarFill className="start-icon" />
                  <p className="job-rating-details">
                    {clickedJobDetails.rating}
                  </p>
                </div>
              </div>
            </div>
            <div className="job-location-type-package-container">
              <div className="job-location-type-container">
                <BsGeoAlt className="location-icon" />
                <p className="job-location-text">
                  {clickedJobDetails.location}
                </p>
                <BsBriefcaseFill className="employment-icon" />
                <p className="job-type-text">
                  {clickedJobDetails.employmentType}
                </p>
              </div>
              <p className="package-text">
                {clickedJobDetails.packagePerAnnum}
              </p>
            </div>
            <hr className="job-list-item-line" />
            <div className="description-website-container">
              <h1 className="job-description-details-heading">Description</h1>
              <div className="link-container">
                <a
                  href={clickedJobDetails.companyWebSiteUrl}
                  className="website-link-style"
                >
                  Visit
                </a>
                <BsBoxArrowUpRight className="website-link-icon" />
              </div>
            </div>
            <p className="job-description-text">
              {clickedJobDetails.jobDescription}
            </p>
            {this.renderSkillsList()}
            {this.renderLifeStyleContainer()}
          </div>
        </div>
      </div>
    )
  }

  renderSimilarJobListItem = eachItem => (
    <li className="similar-list-item-container" key={eachItem.id}>
      <div className="list-item-image-container">
        <img
          className="list-item-image"
          src={eachItem.companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="list-job-title-rating-container">
          <h1 className="job-details-title">{eachItem.title}</h1>
          <div className="start-rating-container">
            <BsStarFill className="start-icon" />
            <p className="job-rating-details">{eachItem.rating}</p>
          </div>
        </div>
      </div>
      <div className="similar-item-description-container">
        <h1 className="job-description-details-heading">Description</h1>
        <p className="job-description-text">{eachItem.jobDescription}</p>
      </div>
      <div className="job-location-type-container">
        <BsGeoAlt className="location-icon" />
        <p className="job-location-text similar-job-text">
          {eachItem.location}
        </p>
        <BsBriefcaseFill className="employment-icon" />
        <p className="job-type-text similar-job-text">
          {eachItem.employmentType}
        </p>
      </div>
    </li>
  )

  renderSimilarJobsList = () => {
    const {similarJobsList} = this.state

    return (
      <ul className="similar-jobs-list">
        {similarJobsList.map(eachItem =>
          this.renderSimilarJobListItem(eachItem),
        )}
      </ul>
    )
  }

  renderJobDetailsAndSkillsAndSimilarJobsPage = () => (
    <div className="job-skills-similar-bg-container">
      <div className="job-details-container">
        {this.renderJobDetailsContainer()}
      </div>
      <div className="similar-jobs-container">
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        {this.renderSimilarJobsList()}
      </div>
    </div>
  )

  renderJobDetailsPage = () => {
    const {jobApiStatus} = this.state

    switch (jobApiStatus) {
      case apiValueConstants.success:
        return this.renderJobDetailsAndSkillsAndSimilarJobsPage()
      case apiValueConstants.failure:
        return this.renderFailure()
      case apiValueConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="each-job-details-bg-container">
        {this.renderJobDetailsPage()}
      </div>
    )
  }
}

export default EachJobDetails
