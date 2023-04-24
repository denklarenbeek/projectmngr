import UserForm from "../../features/users/UserForm"

const { Fragment } = require("react")

const Profile = () => {
  return (
    <Fragment>
        <h1 className='page_title'>Profile</h1>
        <UserForm />
    </Fragment>
  )
}

export default Profile