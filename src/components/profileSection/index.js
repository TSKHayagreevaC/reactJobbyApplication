import './index.css'

const ProfileSection = props => {
  const {
    apiProfileStatus,
    profileData,
    renderLoader,
    getProfileDetails,
    apiStatusValues,
  } = props

  const onClickRetryProfileData = () => {
    getProfileDetails()
  }

  const returnProfileFailure = () => (
    <div className="profile-fail-container">
      <button
        className="profile-retry-button"
        type="button"
        onClick={onClickRetryProfileData}
      >
        Retry
      </button>
    </div>
  )

  const returnProfile = () => (
    <div className="profile-container">
      <img
        className="profile-image"
        src={profileData.profileImageUrl}
        alt="profile"
      />
      <h1 className="profile-name">{profileData.name}</h1>
      <p className="profile-short-bio">{profileData.shortBio}</p>
    </div>
  )

  const returnProfileContainer = () => {
    switch (apiProfileStatus) {
      case apiStatusValues.success:
        return returnProfile()
      case apiStatusValues.failure:
        return returnProfileFailure()
      case apiStatusValues.inProgress:
        return renderLoader()
      default:
        return null
    }
  }

  return <div className="filters-section">{returnProfileContainer()}</div>
}

export default ProfileSection
