import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import useAuth from '../../hooks/useAuth';
import { selectAllUsers } from '../users/usersApiSlice';
import { useAddNewProjectMutation } from './projectsApiSlice';

import './ProjectForm.css';

const ProjectForm = ({handleClose}) => {
    const users = useSelector(selectAllUsers);
    const navigate = useNavigate();
    const { pathname } = useLocation()
    const [addNewProject, {isLoading, isSuccess, isError, error}] = useAddNewProjectMutation();
    const { id } = useAuth()

    const [inputForm, setInputForm] = useState({
        title: '',
        value: 0,
        participants: [],
        status: {value: '1', label: 'Draft'}
    });

    useEffect(() => {
        if(isSuccess) {
            setInputForm({
                title: '',
                value: 0,
                participants: [],
                status: {value: '1', label: 'Draft'}
            })
        }
    }, [isSuccess])

    const options = users ? users.map(user => {return {value: user.id, label: user.name}}) : [];

    const statusOptions = [{value: '1', label: 'Draft'}, {value: '2', label: 'Active'}, {value: '3', label: 'Completed'}];

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const newInputForm = {...inputForm};
        newInputForm[e.target.name] = inputValue;
        setInputForm(newInputForm);
    }

    const handleSelect = (data, inputName) => {
        const newInputForm = {...inputForm};
        newInputForm[inputName] = {...data}
        setInputForm(newInputForm);
    }

    const handleMultiSelect = (e, inputName) => {
        const newInputForm = {...inputForm};
        newInputForm[inputName] = [...e]
        setInputForm(newInputForm);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formObject = {
            title: inputForm.title,
            value: parseInt(inputForm.value),
            status: inputForm.status.label,
            participants: [],
            owner: id //ID from the decoded token
        }
        if(inputForm.participants.length > 0) {
            inputForm.participants.map(participant => formObject.participants.push(participant.value))
        }

        //TODO: VALIDATION OF THE FORM ADD TO THE canSave 
        const canSave = !isLoading

        if(canSave) {
            await addNewProject(formObject)
            if(!pathname.endsWith('/new')) {
                handleClose()
            } else {
                navigate('/dashboard');
            }
        }
    }

    return (
        <div className="form__container">
            <div className="form__container_body">
                <h1>New Project</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" id="title" autoComplete='off' onChange={handleChange} value={inputForm.title} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="value">Value</label>
                        <input type="number" name="value" id="value" onChange={handleChange} value={inputForm.value} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="participant">Participants</label>
                        <Select options={options} isMulti name='participants' onChange={(data) => handleMultiSelect(data, 'participants')} value={inputForm.participants} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <Select options={statusOptions} name='status' onChange={(data) => handleSelect(data, 'status')} value={inputForm.status} />
                    </div>
                    <div className="form-group">
                        <button type="submit">{isLoading ? <i className="fa-solid fa-spinner"></i> : 'Create Project'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectForm