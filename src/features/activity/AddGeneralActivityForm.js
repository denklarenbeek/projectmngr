import { Fragment, useEffect, useState } from "react"
import { format } from "date-fns"

import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersApiSlice"
import { selectAllProjects } from "../projects/projectsApiSlice"
import { useAddNewActivityMutation, useUpdateActivityMutation } from "../activity/activityApiSlice"

import Select from 'react-select'

import useAuth from "../../hooks/useAuth"
import { CATEGORYOPTIONS } from "../../helpers/roleOptions"

const AddGeneralActivityForm = ({activity, handleClose, title = "Add Activity", buttonText = 'Save Activity', submitType = 'create'}) => {
    const { id, name } = useAuth();
    const [addNewActivity] = useAddNewActivityMutation();
    const [updateActivity]= useUpdateActivityMutation()
    const users = useSelector(selectAllUsers);
    const projects = useSelector(selectAllProjects)

    const options = users ? users.map(user => {return {value: user.id, label: user.name}}) : [];
    const projectOptions = projects ? projects.map(project => {return {value: project.id, label: project.title}}) : [];

    const [errors, setErrors] = useState({})
    
    const [formInput, setFormInput] = useState({
        owner: id,
        category: [],
        start_date: '',
        end_date: '',
        participants: [],
        title: '',
        quantity: 0,
        project_id: []
    });

    const isProjectActivity = formInput.category.value?.toLowerCase() === 'costs' || formInput.category.value?.toLowerCase() === 'kilometers' || formInput.category.value?.toLowerCase() === 'hours' || formInput.category.value?.toLowerCase() === 'travel hours'
    
    useEffect(() => {

        if(activity) {
            const endDate = format(new Date(activity.end_date), 'yyyy-MM-dd')
            const startDate = format(new Date(activity.start_date), 'yyyy-MM-dd')
            const participants = activity.participants.map(part => {
                const user = users.find(user => user.id.toString() === part.toString())
                const newParticipant = {
                    label: user.name,
                    value: part,
                }
                return newParticipant
            })
            setFormInput({
                owner: activity.id,
                category: activity.category,
                start_date: startDate,
                end_date: endDate,
                participants: participants,
                title: activity.title
            })
        }

    }, [activity, users])

    const handleChange = (e) => {
        const input = { ...formInput }
        input[e.target.name] = e.target.value
        setFormInput(input)
    }

    const handleMultiSelect = (e, inputName) => {
        const newInputForm = {...formInput};
        newInputForm[inputName] = [...e]
        setFormInput(newInputForm);
    }

    const handleSelect = (e, category) => {
        const inputObj = { ...formInput };
        inputObj[category] = { ...e }
        setFormInput(inputObj);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newObj = { ...formInput }

        if(formInput.participants.length > 0) {
            newObj.participants = []
            formInput.participants.map(participant => newObj.participants.push(participant.value))
        }
        if(formInput.category.length > 0) {
            newObj.category = formInput.category.value
        } else {
            setErrors({category: 'Category is required'})
        }
        if(isProjectActivity) {
            if(formInput.participants.length === 0) setErrors({...errors, participants: 'At least one participant is required'})
            if(formInput.quantity === 0) setErrors({...errors, quantity: 'The quantity has to be greater then 0'})
            if(formInput.project_id.length === 0) setErrors({...errors, project_id: 'A project is required'})
            newObj.project_id = formInput.project_id.value
        } else if (formInput.category.value?.toLowerCase() === 'planned') {
            newObj.project_id = undefined
        }
        if(!errors) {
            if(submitType.toLowerCase() === 'edit'){
                newObj.id = activity.id
                await updateActivity(newObj)
            } else if (submitType.toLowerCase() === 'create') {
                await addNewActivity(newObj)
            }
            handleClose()
        }
    }

    let dynamicContent

    if(isProjectActivity){
        dynamicContent = (
            <Fragment>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" name="quantity" id="quantity" onChange={handleChange} value={formInput.quantity} required />
                    {errors.quantity && <span className="form-error" >{errors.quantity}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="category">Project</label>
                    <Select options={projectOptions} value={formInput.project_id} onChange={(data) => handleSelect(data, 'project_id')} required />
                    {errors.project_id && <span className="form-error" >{errors.project_id}</span>}
                </div>
            </Fragment> 
        )
    }

    if(formInput.category.value?.toLowerCase() === 'planned') {
        dynamicContent = (
            <Fragment>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" onChange={handleChange} value={formInput.title} required />
                    {errors.title && <span className="form-error" >{errors.title}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="participant">Participants</label>
                    <Select options={options} isMulti name='participants' onChange={(data) => handleMultiSelect(data, 'participants')} value={formInput.participants} />
                    {errors.participants && <span className="form-error" >{errors.participants}</span>}
                </div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <div className="form_header">
                <h2>{title}</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="owner">User</label>
                    <input type="text" name="owner" id="owner" onChange={handleChange} value={name} disabled />
                </div> 
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <Select options={CATEGORYOPTIONS} value={formInput.category} onChange={(data) => handleSelect(data, 'category')} required />
                    {errors.category && <span className="form-error" >{errors.category}</span>}
                </div>
                {dynamicContent}
                <div className="col-2">
                    <div className="form-group">
                        <label htmlFor="start_date">Start Date</label>
                        <input type="date" name="start_date" id="start_date" onChange={handleChange} value={formInput.start_date} required />
                        {errors.start_date && <span className="form-error" >{errors.start_date}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="end_date">End Date</label>
                        <input type="date" name="end_date" id="end_date" onChange={handleChange} value={formInput.end_date} />
                        {errors.end_date && <span className="form-error" >{errors.end_date}</span>}
                    </div>
                </div>
                <div className="from-group" style={{display: 'flex'}}>
                    <button type="submit" style={{width: 'inherit', padding: '4px 60px', marginRight: '40px'}} >{buttonText}</button>
                    <button className='button danger' style={{width: 'inherit', padding: '4px 60px'}} onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </Fragment>
    )
}

export default AddGeneralActivityForm