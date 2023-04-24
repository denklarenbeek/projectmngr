import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useActivateUserMutation, useGetUserByTokenQuery } from "../../features/users/usersApiSlice"

import { useNavigate, Link } from "react-router-dom"

import { useDispatch } from "react-redux"
import { setCredentials } from "../../features/auth/authSlice"
import { useLoginMutation } from "../../features/auth/authApiSlice"


const ActivateUser = () => {

    const { token } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { data: user, isLoading, isSuccess, isError, error }= useGetUserByTokenQuery(token);
    const [activateUser, {isLoadingActivate, isSuccessActivate, isErrorActivate, errorActivte}] = useActivateUserMutation();
    const [login] = useLoginMutation()

    const [formInput, setFormInput] = useState({
        email: '',
        name: '',
        password: '',
        password2: '' 
    })

    const [errors, setErrors] = useState('');

    let content

    const handleChange = (e) => {
        const newInputForm = { ...formInput };
        newInputForm[e.target.name] = e.target.value;;
        setFormInput(newInputForm);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(formInput.password !== formInput.password2) setErrors({password2: "The passwords doesn't match"})
        const userObj = { ...formInput }
        userObj.token = token
        const result = await activateUser(userObj).unwrap()
        const { accessToken } = await login({ email: formInput.email, password: formInput.password }).unwrap()
        dispatch(setCredentials({ accessToken }))
        navigate('/dashboard')
    }

    useEffect(() => {
        if(user) {
            setFormInput({email: user.user[0].email, name: user.user[0].name, password: '', password2: ''})
        }
    }, [isSuccess])

    if(isLoading) {
        content = (<i className="fa-solid fa-spinner"></i>)
    } else if (isError) {
        content = (
            <div className="public">
                <section style={{textAlign: 'center'}}>
                    <h2>This page cannot be found</h2>
                    <p>Please redirect to the home page <a href="/" style={{borderBottom: '1px solid black'}} >Home</a> </p>
                </section>
            </div>
        )
    } else if(isSuccess) {
        content = (
            <div className="public">
                <section>
                    <header>
                        <h1>Active User</h1>
                    </header>
                    <main className="login">
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" disabled value={formInput.email} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" value={formInput.name} onChange={handleChange} />
                                {errors.name && <p className="error-message">{errors.name}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" id="password" value={formInput.password} onChange={handleChange} />
                                {errors.password && <p className="error-message">{errors.password}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password2">Confirm Password</label>
                                <input type="password" name="password2" id="password2" value={formInput.password2} onChange={handleChange}/>
                                {errors.password2 && <p className="error-message">{errors.password2}</p>}
                            </div>
                            <div className="form-group">
                                <button type="submit">Active My Profile</button>
                            </div>
                        </form>
                    </main>
                </section>
            </div>
        )
    }

    return content

}

export default ActivateUser