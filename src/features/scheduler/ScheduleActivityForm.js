import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersApiSlice"
import Select from 'react-select'

import { useAddNewActivityMutation, useDeleteActivityMutation, useUpdateActivityMutation } from "../activity/activityApiSlice"

import { format } from "date-fns"

import useAuth from "../../hooks/useAuth"
import Spinner from "../../helpers/spinner"

const ScheduleActivityForm = ({activity, handleClose, title = "Add Activity", buttonText = 'Save Activity', submitType = 'create'}) => {
    const { id, name } = useAuth();
    //TODO: NOTIFICATION RESPONS ON ERROR FOR UPDATE, NEW & DELETE CALL
    const [addNewActivity, {isLoading, isSuccess}] = useAddNewActivityMutation()
    const [updateActivity, {isLoading: isLoadingUpdate, isSuccess: isSuccessUpate}]= useUpdateActivityMutation()
    const [deleteActivity, {isLoading: loadingDelete, isSuccess: successDelete}] = useDeleteActivityMutation()
    const [buttonLoading, setButtonLoading] = useState(false)
    const users = useSelector(selectAllUsers);
    const options = users ? users.map(user => {return {value: user.id, label: user.name}}) : [];

    const [formInput, setFormInput] = useState({
        owner: id,
        category: 'Planned',
        start_date: '',
        end_date: '',
        participants: [],
        title: '',
    });

    useEffect(() => {
        setButtonLoading(isLoading)
    }, [isLoading])

    useEffect(() => {
        setButtonLoading(isLoadingUpdate)
    }, [isLoadingUpdate])

    useEffect(() => {
        if(isSuccess || isSuccessUpate || successDelete) {
            handleClose()
        }
    }, [isSuccess, isSuccessUpate, successDelete, handleClose])

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newObj = { ...formInput }

        if(formInput.participants.length > 0) {
            newObj.participants = []
            formInput.participants.map(participant => newObj.participants.push(participant.value))
        }
        if(submitType.toLowerCase() === 'edit'){
            newObj.id = activity.id
            await updateActivity(newObj)
        } else if (submitType.toLowerCase() === 'create') {
            await addNewActivity(newObj)
        }
    }
    
    const handleDelete = async () => {
        const { id } = activity;
        try {
            await deleteActivity({id});
        } catch (error) {
            console.log(error)
        }
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
                    <input type="text" name="category" id="category" onChange={handleChange} value={formInput.category} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" onChange={handleChange} value={formInput.title} required />
                </div>
                <div className="form-group">
                        <label htmlFor="participant">Participants</label>
                        <Select options={options} isMulti name='participants' onChange={(data) => handleMultiSelect(data, 'participants')} value={formInput.participants} />
                    </div>
                <div className="col-2">
                    <div className="form-group">
                        <label htmlFor="start_date">Start Date</label>
                        <input type="date" name="start_date" id="start_date" onChange={handleChange} value={formInput.start_date} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="end_date">End Date</label>
                        <input type="date" name="end_date" id="end_date" onChange={handleChange} value={formInput.end_date} />
                    </div>
                </div>
                <div className="from-group" style={{display: 'flex'}}>
                    <button type="submit" style={{width: 'inherit', padding: '4px 60px', marginRight: '40px'}} >{buttonLoading ? <Spinner /> : buttonText}</button>
                    <button className='button danger' style={{width: 'inherit', padding: '4px 60px'}} onClick={handleDelete}>{loadingDelete ? <Spinner /> : 'Delete'}</button>
                </div>
            </form>
        </Fragment>
    )
}

export default ScheduleActivityForm