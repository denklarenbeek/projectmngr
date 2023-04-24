import React, { Fragment, useEffect, useState } from 'react'
import { useResetPasswordMutation } from '../auth/authApiSlice'; 


const Resetpassword = ({title, handleClose}) => {

    const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation()
    const [email, setEmail] = useState('');
    
    const handleChange = (e) => {
        setEmail(e.target.value)
    };

    useEffect(() => {
        if(isSuccess) {
            handleClose()
        }
    }, [isSuccess])

    const handleSubmit = (e) => {
        e.preventDefault()
        resetPassword({email}) 
    }

    return (
        <Fragment>
            <div className="form_header">
                <h2>{title}</h2>
            </div>
            {isLoading && <div className='loading'><i className="fa-solid fa-spinner"></i></div>}
            {!isLoading && <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" value={email}  onChange={handleChange}/>
                    <span className="tip">If your e-mail address is registred you will receive an e-mail</span>
                </div>
                <div className="from-group" style={{display: 'flex'}}>
                    <button type="submit" style={{width: 'inherit', padding: '4px 60px', marginRight: '40px'}}>Reset</button>
                    <button className='button danger' style={{width: 'inherit', padding: '4px 60px'}} onClick={() => handleClose()}>Cancel</button>
                </div>
            </form>
            }
        </Fragment>
    )
}

export default Resetpassword