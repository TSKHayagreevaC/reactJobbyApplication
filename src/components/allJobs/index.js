import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import './index.css'

import ProfileSection from '../profileSection'
import JobListItem from '../jobListItem'

const apiStatusValues = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
class AllJobs extends Component {
  state = {
    apiJobsStatus: apiStatusValues.initial,
    apiProfileStatus: apiStatusValues.initial,
    profileData: [],
    jobsList: [],
    searchInput: '',
    searchEmploymentType: [],
    minimumPackage: '',
  }

  componentDidMount() {
    this.getJobsDetails()
    this.getProfileDetails()
  }

  getJobsDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {searchEmploymentType, minimumPackage, searchInput} = this.state
    const searchEmploymentTypeString = searchEmploymentType.join(',')

    const apiJobsUrl = `https://apis.ccbp.in/jobs?employment_type=${searchEmploymentTypeString}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    this.setState({apiJobsStatus: apiStatusValues.inProgress})
    const response = await fetch(apiJobsUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiJobsStatus: apiStatusValues.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusValues.failure})
    }
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiProfileUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    this.setState({apiProfileStatus: apiStatusValues.inProgress})
    const profileResponse = await fetch(apiProfileUrl, options)
    if (profileResponse.ok) {
      const profileData = await profileResponse.json()
      const updatedProfileData = {
        profileImageUrl: profileData.profile_details.profile_image_url,
        name: profileData.profile_details.name,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedProfileData,
        apiProfileStatus: apiStatusValues.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusValues.failure})
    }
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs-image"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-text">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderList = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderNoJobsView()
    }
    return (
      <ul className="jobs-list">
        {jobsList.map(eachJob => (
          <JobListItem key={eachJob.id} eachJob={eachJob} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getJobsDetails()
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

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    this.getJobsDetails()
  }

  renderSearchInputContainer = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          className="jobs-search-input"
          type="search"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          placeholder="Search"
        />
        <button
          className="search-form-button"
          type="button"
          testid="searchButton"
          onClick={this.onClickSearchButton}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  addEmploymentTypeQuery = event => {
    if (event.target.checked) {
      this.setState(
        prevItem => ({
          searchEmploymentType: [
            ...prevItem.searchEmploymentType,
            event.target.id,
          ],
        }),
        this.getJobsDetails,
      )
    }
  }

  renderEmploymentTypeCheckList = () => (
    <div className="employment-type-container">
      <h1 className="employment-type-heading">Type of Employment</h1>
      <ul className="employment-type-list">
        {employmentTypesList.map(eachItem => (
          <li className="employment-list-item" key={eachItem.employmentTypeId}>
            <div className="employment-list-item-container">
              <input
                type="checkbox"
                id={`${eachItem.employmentTypeId}`}
                onChange={this.addEmploymentTypeQuery}
                value={eachItem.employmentTypeId}
              />
              <label
                htmlFor={`${eachItem.employmentTypeId}`}
                className="list-item-text"
              >
                {eachItem.label}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )

  addSalaryRangeQuery = event => {
    this.setState({minimumPackage: event.target.id}, this.getJobsDetails)
  }

  renderSalaryRangeList = () => (
    <div className="employment-type-container">
      <h1 className="employment-type-heading">Salary Range</h1>
      <ul className="employment-type-list">
        {salaryRangesList.map(eachItem => (
          <li className="employment-list-item" key={eachItem.salaryRangeId}>
            <div className="employment-list-item-container">
              <input
                type="radio"
                id={`${eachItem.salaryRangeId}`}
                onChange={this.addSalaryRangeQuery}
                value={eachItem.salaryRangeId}
                name="salaryRange"
              />
              <label
                htmlFor={`${eachItem.salaryRangeId}`}
                className="list-item-text"
              >
                {eachItem.label}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )

  renderJobsListPage = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiStatusValues.success:
        return this.renderList()
      case apiStatusValues.failure:
        return this.renderFailure()
      case apiStatusValues.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {apiProfileStatus, profileData} = this.state

    return (
      <div className="all-jobs-bg-container">
        <div className="filters-bg-container">
          <div className="small-form-container">
            {this.renderSearchInputContainer()}
          </div>
          <ProfileSection
            apiProfileStatus={apiProfileStatus}
            profileData={profileData}
            renderLoader={this.renderLoader}
            apiStatusValues={apiStatusValues}
            getProfileDetails={this.getProfileDetails}
          />
          <hr className="filters-line" />
          {this.renderEmploymentTypeCheckList()}
          <hr className="filters-line" />
          <div className="salary-range-container">
            {this.renderSalaryRangeList()}
          </div>
        </div>
        <div className="jobs-list-bg-container">
          <div className="jobs-list-section">
            <div className="large-form-container">
              {this.renderSearchInputContainer()}
            </div>
            {this.renderJobsListPage()}
          </div>
        </div>
      </div>
    )
  }
}

export default AllJobs
