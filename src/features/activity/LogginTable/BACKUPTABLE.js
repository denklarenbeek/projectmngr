import React, { useEffect, useState, Fragment } from 'react'
import Select from 'react-select'
import { selectProjectById } from '../../projects/projectsApiSlice';
import { useAddNewActivityMutation, useDeleteActivityMutation } from '../activityApiSlice';

import LoggingTableRow from './LoggingTableRow';
import './LoggingTable.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const LoggingTable = ({activities, title, activityCategory, projectParticipants}) => {
    const { id } = useParams();
    const project = useSelector(state => selectProjectById(state, id));
    const [addNewActivity, {isLoading, isSuccess, isError, error}] = useAddNewActivityMutation();
    const [deleteActivity] = useDeleteActivityMutation();

    const [inputForm, setInputForm] = useState({
        owner: {label: '', value: ''},
        quantity: 0,
        start_date: '',
        end_date: ''
    });
    const [canSave, setCanSave] = useState(false);

    // let optionsUsers = [];

    // optionsUsers = projectParticipants?.map(participant => {
    //     return  {
    //         value: participant._id,
    //         label: participant.name
    //     }
    // })

    useEffect(() => {
        const validOwner = inputForm.owner.value?.length > 3 && inputForm.owner !== undefined;
        const validQuantity = inputForm.quantity > 0 && inputForm.quantity !== undefined ;
        const validDate = inputForm.start_date.length > 3 && inputForm.start_date !== undefined;

        if(validDate && validQuantity && validOwner) {
            setCanSave(true)
        }
    }, [inputForm]);

    const handleChange = (e) => {
        const inputObject = {...inputForm};
        if(e.target.id === 'hours' && !NaN && !undefined) {
            inputObject[e.target.id] = parseInt(e.target.value)
        } else {
            inputObject[e.target.id] = e.target.value;
        };
        setInputForm(inputObject);
    }

    const handleSelectInput = (e) => {
        const inputObj = {...inputForm};
        inputObj.owner = {...e}
        console.log(inputObj);
        setInputForm(inputObj);
    }

    const addActivityToTable = async () => {
        if(canSave) {
            const activityObject = {
                owner: inputForm.owner.value,
                category: activityCategory,
                project_id: project.id,
                start_date: inputForm.start_date,
                quantity: inputForm.quantity
            }
            await addNewActivity(activityObject);
            setInputForm({owner: {label: '', value: ''}, quantity: 0, start_date: ''});
        }
        setCanSave(false)
    }

    const deleteActivityFromTable =  async (id) => {
        await deleteActivity({id});
    }

    let content

    content = (
        <div className="table__container">
            <h3>{title}</h3>
            <table className='logging__table'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Start Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {activities?.map(row => {
                    return <LoggingTableRow key={row.id} item={row} deleteActivity={deleteActivityFromTable} />
                })}
                <tr>
                    <td>
                        <Select options={projectParticipants} onChange={handleSelectInput} name='owner' id='owner' value={inputForm.owner} />
                    </td>
                    <td><input type="number" name="quantity" id="quantity" onChange={handleChange} value={inputForm.quantity} /></td>
                    <td><input type="date" name="start_date" id="start_date" onChange={handleChange} value={inputForm.start_date} /></td>
                    {canSave && <td><i className="fa-regular fa-square-plus table__actions_item add_row" onClick={addActivityToTable}></i></td>}
                </tr>
            </tbody>
        </table>
    </div>
    )
    return content
}

export default LoggingTable