import { Fragment, useState } from "react"
import { selectAllUsers, useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import { useSelector } from "react-redux"
import Modal from "../modal/Modal"
import NewUser from "./NewUser"


const UserList = () => {

  const users = useSelector(selectAllUsers);
  const [modal, setModal] = useState(false);

  let content

  const handleClose = () => {
    setModal(false)
  }

  if(users) {

    content =  (
      <Fragment>
        <div className="page__header">
          <h1>USERS</h1>
          <a style={{display: 'inline-block'}}>
                <div className="button_create_entity" onClick={() => setModal(true)} >
                  <i className="fa-solid fa-plus"></i>
                    <p>Invite New User</p>
                </div>
            </a>
        </div>
        <div className="userlist__container">
          {users.map(user => <User key={user._id} user={user} />)}
        </div>
        <Modal show={modal} handleClose={handleClose}>
          <NewUser handleClose={handleClose} />
        </Modal>
      </Fragment>
    )
  }

  return content
}

export default UserList