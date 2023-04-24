import { Fragment, useEffect, useState } from "react" 
import Select from 'react-select'
import {ROLEOPTIONS} from '../../helpers/roleOptions';
import { useInviteNewUserMutation } from "./usersApiSlice";

const NewUser = ({handleClose}) => {

    const [inviteNewUser, { isLoading, isSuccess, isError, error }] = useInviteNewUserMutation()

    const [formInput, setFormInput] = useState({
        name: '',
        email: '',
        role: {}
    })

    useEffect(() => {
        if(isSuccess) {
            cancelRegisterForm()
        }
    }, [isSuccess])
  
    const handleChange = (e) => {
        const newObject = {...formInput}
        newObject[e.target.name] = e.target.value
        setFormInput(newObject)
    }

    const handleSelect = (data, inputName) => {
        const newInputForm = {...formInput};
        newInputForm[inputName] = {...data}
        setFormInput(newInputForm);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        formInput.role = formInput.role.label
        inviteNewUser(formInput)
    }

    const cancelRegisterForm = () => {
        // setFormInput(null)
        handleClose()
    }

    return (
        <Fragment>
            <div className="form_header">
                <h2>Invite New User</h2>
            </div>
            {isError && <p>{error.data.message}</p>}
            {isLoading && <div className='loading'><i className="fa-solid fa-spinner"></i></div>}
            {!isLoading && <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name"  onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" onChange={handleChange}  />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <Select options={ROLEOPTIONS} value={formInput.role} onChange={(data) => handleSelect(data, 'role')} />
                    <span className="tip">You can change this later</span>
                </div>
                <div className="from-group" style={{display: 'flex'}}>
                    <button type="submit" style={{width: 'inherit', padding: '4px 60px', marginRight: '40px'}} >Save</button>
                    <button className='button danger' style={{width: 'inherit', padding: '4px 60px'}} onClick={cancelRegisterForm}>Cancel</button>
                </div>
            </form>
            }
        </Fragment>
    )
}

export default NewUser