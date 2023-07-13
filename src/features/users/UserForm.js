import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Modal from "../modal/Modal";
import ChangePassword from './ChangePassword';
import { useUpdateUserProfileMutation } from "./usersApiSlice";
import { useSendLogoutMutation } from "../auth/authApiSlice";

import './UserForm.css';
import { logOut } from "../auth/authSlice";

const UserForm = () => {
    const {id, name, email, picture} = useAuth();
    const navigate = useNavigate()
    const [updateUserProfile, {isLoading, isSuccess, isError, error}] = useUpdateUserProfileMutation()
    const [sendLogout] = useSendLogoutMutation();

    const [modal, setModal] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)

    const [userForm, setUserForm] = useState({
        name: name || '',
        email: email || '',
        picture: picture || ''
    })

    const [selectFile, setSelectFile] = useState({
        currentFile: undefined,
        preview: undefined
    });

    const handleChange = (e) => {
        const newUserObject = {...userForm}
        newUserObject[e.target.name] = e.target.value
        setUserForm(newUserObject)
    }

    const handleFileUpload = (e) => {
        if(e.target.files.length > 0) {
            const previewUrl = URL.createObjectURL(e.target.files[0]);
            setSelectFile({
                preview: previewUrl,
                currentFile: e.target.files[0]
            });
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        // const inputs = {
        //     id,
        //     email,
        //     file: selectFile.currentFile
        // }
        const inputs = new FormData();
        if(selectFile.currentFile){
            inputs.append('image', selectFile.currentFile)
        }
        inputs.append('id', id)
        inputs.append('email', email)
        try {
            inputs.get('image')
            await updateUserProfile({inputs})
            // sendLogout()
            // navigate('/login')
        } catch (error) {
            console.log(error)
        }
        
    }

    const handleClose = () => {
        setModal(false)
    }
    
    const content = (
        <div className="form__container">
            <div className="form__container_body">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {selectFile.currentFile ? <img src={selectFile.preview} alt="profile picture" className="profile__picture" /> : <img src={picture} alt="profile picture" className="profile__picture" />}
                    <div className="form-group">
                        <label htmlFor="image">Picture</label>
                        <input type="file" name="image" id="image" onChange={handleFileUpload} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" autoComplete='off' onChange={handleChange} value={userForm.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" autoComplete='off' onChange={handleChange} value={userForm.email} />
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'loading' : ''}`} > {isLoading ? <i className="fa-solid fa-spinner"></i> : 'Save Changes'}</button>
                    </div>
                </form>
                <div className="break"></div>
                <div className="form-group" style={{marginTop: '20px'}}>
                    <div className="button_create_entity" style={{width: '200px', justifyContent: 'center'}} onClick={() => setModal(true)} >
                        <p>Change Password</p>
                    </div>  
                </div>
            </div>
            <Modal show={modal} handleClose={handleClose}>
                <ChangePassword handleClose={handleClose} title={'Change Password'} />
            </Modal>
        </div>
    )

    return content
}

export default UserForm