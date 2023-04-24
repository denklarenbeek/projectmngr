import { useEffect, useState } from 'react';
import Select from 'react-select';
import useAuth from '../../hooks/useAuth';
import { useChangeUserRoleMutation, useDeleteUserMutation } from './usersApiSlice';
import { ROLEOPTIONS } from '../../helpers/roleOptions';

import './User.css';

const User = ({user}) => {

    const [role, setRole] = useState({label: user.roles[0], value: user.roles[0]})
    const { id } = useAuth()
    const [changeUserRole, {isLoading, isSuccess, isError, error}] = useChangeUserRoleMutation()
    const [successIconVisible, setSuccessIconVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false);
    const [deleteUser, {isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete}] = useDeleteUserMutation()

    const isCurrentUser = user.id === id

    const handleChange = (data) => {
        setRole(data)
        const newRole = {
            id: user.id,
            role: [data.value]
        }
        changeUserRole(newRole)
    }

    useEffect(() => {
        if(isSuccess) {
            setSuccessIconVisible(true)
            setTimeout(() => {
                setSuccessIconVisible(false)
            }, 3000)
        }

        if(isErrorDelete) {
            setErrorMessage(true)
            setTimeout(() => {
                setErrorMessage(false)
            }, 3000)
        }

    }, [isSuccess, isErrorDelete])

    const deleteUserHandler = () => {
        deleteUser(user.id)
    }

    return (
        <div className="user__container hoverable" style={{cursor: 'inherit'}} >
            <div className='user__picture'>
                <img src={user.picture} alt="profile picture" />
            </div>
            <div className='user__name' >
                <p>{user.name}</p>
                <p>{user.email}</p>
            </div>
            <div className={`user__role ${isSuccess ? 'success' : ''}`}>
                {isCurrentUser && <p>{role.label}</p>}
                {!isCurrentUser && ( <Select
                    value={role}
                    onChange={handleChange}
                    options={ROLEOPTIONS} />)}
            </div>
            <div className='user__status' >
                <p className={`status__icon ${user.status.toLowerCase() === 'active' ? 'active' : user.status.toLowerCase() === 'pending' ? 'pending' : 'inactive'}`} ></p>
                <p>{user.status}</p>
            </div>
            <div className={`user__action ${isCurrentUser ? 'nohover' : ''}`} onClick={deleteUserHandler} >
                <i className="fa-solid fa-trash"></i>
                {isCurrentUser && <span className='helper'>You cannot change the current logged in user</span>}
            </div>
            {successIconVisible && <div className='success__message'><i className="fa-solid fa-circle-check"></i></div>}
            {isLoading || isLoadingDelete && <div className='loading'><i className="fa-solid fa-spinner"></i></div>}
            {errorMessage && <div className='error__message'>{errorDelete.data.message}</div>}
        </div>
    )
}

export default User