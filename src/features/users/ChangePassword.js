import { Fragment, useState, useEffect } from "react"
import { useChangePasswordMutation } from "../auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../helpers/spinner";

const ChangePassword = ({handleClose, title, user, token}) => {

    const { id } = useAuth();

    const [formInput, setFormInput] =  useState({
        passwordold: '',
        password: '',
        password2: '',
        token: token || ''
    });

    const [changePassword, { isLoading, isSuccess, isError, error }] = useChangePasswordMutation()
    const navigate = useNavigate()

    const isToken = token?.length > 0;

    useEffect(() => {
        if(isSuccess) {
            navigate('/login')
        }
        
    }, [isSuccess, navigate])

    const handleChange = (e) => {
        const newObject = {...formInput}
        newObject[e.target.name] = e.target.value
        setFormInput(newObject)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(id) {
            formInput.id = id
        }
        await changePassword(formInput)
    }

    return (
        <Fragment>
            {isError && <p>{error.data.message}</p>}
            <div className="form_header">
                <h2>{title}</h2>
            </div>
            <form onSubmit={handleSubmit}>
                {isToken ? (
                    <div className="form-group">
                        <label htmlFor="token">Token</label>
                        <input type="password" name="token" disabled id="token" value={formInput.token}  onChange={handleChange}/>
                    </div>
                ) : (
                    <div className="form-group">
                        <label htmlFor="passwordold">Old Password</label>
                        <input type="password" name="passwordold" id="passwordold" value={formInput.passwordold}  onChange={handleChange}/>
                    </div>
                )}
                <div className="break" style={{marginBottom: '20px'}}></div>
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input type="password" name="password" id="password" value={formInput.password}  onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password2">Confirm Password</label>
                    <input type="password" name="password2" id="password2" value={formInput.password2}  onChange={handleChange}/>
                </div>
                <div className="from-group" style={{display: 'flex'}}>
                    <button type="submit" style={{width: 'inherit', padding: '4px 60px', marginRight: '40px'}}>{ isLoading ? <Spinner/> : "Save"}</button>
                    <button className='button danger' style={{width: 'inherit', padding: '4px 60px'}} onClick={() => handleClose()}>Cancel</button>
                </div>
            </form>
        </Fragment>
    )
}

export default ChangePassword