import { Fragment, useEffect, useState } from "react"
import Select from 'react-select'

import { useAddNewActivityMutation } from "./activityApiSlice"

import { CATEGORYOPTIONS } from "../../helpers/roleOptions"

import useAuth from "../../hooks/useAuth"
import Spinner from "../../helpers/spinner"

const AddActivityForm = ({handleClose, projectId}) => {
    const { id, name } = useAuth();
    //TODO: ERROR HANDLER ON NEW ACITIVITY
    const [addNewActivity, {isLoading, isSuccess}] = useAddNewActivityMutation();

    const [formInput, setFormInput] = useState({
        owner: id,
        category: {},
        project_id: projectId,
        quantity: '',
        start_date: '',
        end_date: '',
    });

    const [differentEndDate, setDifferentEndDate] = useState(false)

    useEffect(() => {
        if(isSuccess) {
            handleClose()
        }
    }, [isSuccess])

    const handleChange = (e) => {
        const input = { ...formInput }
        input[e.target.name] = e.target.value
        setFormInput(input)
    }

    const handleSelect = (e, category) => {
        const inputObj = { ...formInput };
        inputObj[category] = { ...e }
        setFormInput(inputObj);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newObj = { ...formInput }
        if(formInput.end_date === '') {
            newObj['end_date'] = formInput.start_date
            console.log('empty end date')
        }
        newObj['category'] = formInput.category.value
        console.log(newObj);
        await addNewActivity(newObj)
    }

    const toggleEndDate = () => {
        const newObj = { ...formInput }
        newObj['end_date'] = ''
        setFormInput(newObj)
        setDifferentEndDate(!differentEndDate)
    }

    const filterCatOptions = CATEGORYOPTIONS.filter(option => option.value.toLowerCase() !== 'planned')

    return (
        <Fragment>
            <div className="form_header">
                <h2>Add New Activity</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="owner">User</label>
                    <input type="text" name="owner" id="owner" onChange={handleChange} value={name} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <Select options={filterCatOptions} value={formInput.category} onChange={(data) => handleSelect(data, 'category')} required />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" name="quantity" id="quantity" onChange={handleChange} value={formInput.quantity} required />
                </div>
                <div className="col-2">
                    <div className="form-group">
                        <label htmlFor="start_date">Start Date</label>
                        <input type="date" name="start_date" id="start_date" onChange={handleChange} value={formInput.start_date} required />
                    </div>
                    {differentEndDate && (
                        <div className="form-group">
                            <label htmlFor="end_date">End Date</label>
                            <input type="date" name="end_date" id="end_date" onChange={handleChange} value={formInput.end_date} />
                        </div>
                    )}
                </div>
                <div className="form-group checkbox small" style={{marginTop: '-20px'}} >
                    <label htmlFor="differentenddate" >Different End Date</label>
                    <input type="checkbox" name="differentenddate" id="differentenddate" onChange={toggleEndDate} />
                </div>
                <div className="from-group" style={{display: 'flex'}}>
                    <button type="submit" style={{width: 'inherit', padding: '4px 60px', marginRight: '40px'}} >{isLoading ? <Spinner /> : "Save"}</button>
                    <button className='button danger' style={{width: 'inherit', padding: '4px 60px'}} onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </Fragment>
    )
}

export default AddActivityForm