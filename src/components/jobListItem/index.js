import {Link} from 'react-router-dom'
import {BsStarFill, BsBriefcaseFill, BsGeoAlt} from 'react-icons/bs'

import './index.css'

const JobListItem = props => {
  const {eachJob} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = eachJob
  return (
    <Link to={`/jobs/${id}`} className="link-style">
      <li className="job-list-item">
        <div className="job-list-item-container">
          <div className="list-item-image-container">
            <img
              className="job-list-item-image"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div className="list-job-title-rating-container">
              <h1 className="job-title">{title}</h1>
              <div className="start-rating-container">
                <BsStarFill className="start-icon" />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-location-type-package-container">
            <div className="job-location-type-container">
              <BsGeoAlt className="job-location-icon" />
              <p className="job-item-location-text">{location}</p>
              <BsBriefcaseFill className="job-type-icon" />
              <p className="job-item-type-text">{employmentType}</p>
            </div>
            <p className="package-text">{packagePerAnnum}</p>
          </div>
          <hr className="job-list-item-line" />
          <h1 className="jon-description-heading">Description</h1>
          <p className="job-description-text">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobListItem
