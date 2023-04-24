import React, { Fragment, useState } from 'react'
import { useUpdateProjectMutation } from './projectsApiSlice';
import { selectAllUsers } from '../../features/users/usersApiSlice';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import useAuth from '../../hooks/useAuth';
import Modal from '../modal/Modal';
import ProjectExport from './ProjectExport';

import { pluck } from '../../helpers/helpers';

const ProjectDetails = ({project, projectBreakdown, projectActivities, setProjectValue, setProjectParticipants, projectIsCompleted, setProjectIsCompleted, toggleCharts, showProjectCharts, totalHours, totalCosts, totalKilometers}) => {
    const [updateProject, {isLoading, isSuccess, isError, error}] = useUpdateProjectMutation();
    const users = useSelector(selectAllUsers);
    const {id, roles, isAdmin, isSuperUser} = useAuth()

    const isOwnerOfProjectorAdmin = project.owner._id === id || isAdmin || isSuperUser

    const [editMode, setEditMode] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false)
    const [errorParticipants, setErrorParticipants] = useState('')

    let editedParticipant = project?.participants.map((participant) => {
        const editedParticipant = {
          value: participant._id,
          label: participant.name
        }
        return editedParticipant
    })

    const [inputForm, setInputForm] = useState({        
      title: project?.title,
      value: project?.value,
      participants: editedParticipant,
      status: {value: project?.status, label: project?.status},
      started_at: project?.started_at
    });

    const options = users ? users.map(user => {return {value: user.id, label: user.name}}) : [];
    const statusOptions = [{value: '1', label: 'Draft'}, {value: '2', label: 'Active'}, {value: '3', label: 'Completed'}];

    const handleEditMode = () => {
        setEditMode(true);
    }

    const handleCancelEditMode = () => {
        setInputForm({
            title: project?.title,
            value: project?.value,
            participants: editedParticipant,
            status: {value: project?.status, label: project?.status},
            started_at: project?.started_at
        })
        setEditMode(false)
    }
    
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

    const handleCloseExportModal = () => {
        setShowExportModal(false)
    }

    const handleSubmit = async(e, update_sort) => {
        e.preventDefault();
        const participantIds = inputForm.participants.map((participant) => {
            return participant.value
        });

        //Check if the participants match with the registered users and put the result in the array
        const unique = [...new Set(projectActivities.map(item => item.owner._id))]
        const isRegistered = unique.map((id) => {
           if(participantIds.indexOf(id) === -1){
            return false
            // THE REMOVED USER HAS STILL REGISTRED ACTIVITY, PLEASE DELETE THAT FIRST
           } else return true
        })

        const newObject = {
            id: project.id,
            title: inputForm.title,
            participants: participantIds,
            status: inputForm.status.label,
            started_at: inputForm.started_at,
            value: inputForm.value
        }

        // Check if all the registered user of the activity are also a participant. If there is no false in the array we can update the project.
        if(isRegistered.indexOf(false) === -1){
            await updateProject(newObject)
            newObject.participants = inputForm.participants
            newObject.status = inputForm.status
            setInputForm(newObject)
            setProjectValue(inputForm.value)
            setProjectParticipants(inputForm.participants)
        } else {
            setErrorParticipants('You cannot delete a participant who has activity registered')
            setInputForm({        
                title: project?.title,
                value: project?.value,
                participants: editedParticipant,
                status: {value: project?.status, label: project?.status},
                started_at: project?.started_at
            })
        }
        setEditMode(false)
        setTimeout(() => {
            setErrorParticipants('')
        }, 3000)
    }

    const completeProject = async () => {
        const participantIds = inputForm.participants.map((participant) => {
            return participant.value
        });

        const stateObject = {...inputForm}
        stateObject.status = {label: 'Completed', value: 'Completed'}
        setInputForm(stateObject)
        
        const newObject = {
            id: project.id,
            title: inputForm.title,
            participants: participantIds,
            status: 'Completed',
            started_at: inputForm.started_at,
            value: inputForm.value
        }
        try {
            await updateProject(newObject)
            setProjectIsCompleted(true)
        } catch (error) {
            console.log('Something went wrong', error)
        }
    }

    const extraEditModeContent = (
        <Fragment>
            <div className="information__group">
                <h3>Project Value:</h3>
                <div className="information__group_result">
                    <input type="number" name="value" id="value" value={inputForm.value} onChange={handleChange} />
                </div>
            </div>
            <div className="information__group">
                <button onClick={handleSubmit} type="submit" style={{width: '100px'}}>Save</button>
                <button className='button danger' onClick={handleCancelEditMode} style={{marginLeft: '20px', width: '100px'}}>Cancel</button>
            </div>
        </Fragment>
    )

    const editTitle = (
        <div className="information__group">
            <input type="text" name="title" id="title" value={inputForm.title} onChange={handleChange} style={{width: "500px", lineHeight: "32px", fontWeight: "bold", textTransform: "uppercase", fontSize: '20px'}} />
        </div>
    )

    return (
        <Fragment>
            <div className="page__header page_title">
                  {editMode ? editTitle : 
                  <h1>{inputForm.title} {isOwnerOfProjectorAdmin  && !projectIsCompleted && <span onClick={handleEditMode} ><i className={editMode ? '' :"fa-regular fa-pen-to-square edit_icon"}></i></span>}</h1>}
                    
                    <div className="button_group">
                    {isOwnerOfProjectorAdmin && !projectIsCompleted && (
                        <div className="button_create_entity success" onClick={completeProject} >
                            {isLoading ? <i className="fa-solid fa-spinner"></i> : <Fragment><i className="fa-regular fa-circle-check"></i><p>Complete Project</p></Fragment> }
                        </div>
                    )}
                        <div className="button_create_entity outline" onClick={toggleCharts} >
                            <i className="fa-solid fa-chart-pie"></i>
                           <p>{showProjectCharts ? 'Hide Charts' : 'Show Charts'}</p>
                        </div>
                        <div className="button_create_entity outline" style={{borderTop: 'none'}} onClick={() => setShowExportModal(true)} >
                            <i className="fa-solid fa-download"></i>
                           <p>Export Project</p>
                        </div>
                    </div>
            </div>
            <div className="project__body__information">
                <div className="information__group" style={{position: 'relative'}}>
                    <h3>Participants:</h3>
                    <div className="information__group_result">
                    {editMode ? 
                    <Select 
                        options={options} 
                        isMulti 
                        name='participants' 
                        onChange={(data) => 
                        handleMultiSelect(data, 'participants')} 
                        value={inputForm.participants} 
                    /> : inputForm?.participants?.map(participant => <p key={participant.value} >{participant.label}</p>)}
                    </div>
                    {errorParticipants.length > 0 && <p style={{position: 'absolute', bottom: 0, left: '200px', fontSize: '12px', color: 'var(--red-color)'}} >{errorParticipants}</p>  }
                </div>
                <div className="information__group">
                    <h3>Status:</h3>
                    <div className="information__group_result">
                    {editMode ? <Select 
                        options={statusOptions} 
                        name='status' 
                        onChange={(data) => handleSelect(data, 'status')} 
                        value={inputForm.status} 
                    /> : inputForm?.status.label}
                    </div>
                </div>
                <div className="information__group">
                    <h3>Starting Date:</h3>
                    <div className="information__group_result">
                    {editMode ? <input type="date" name="started_at" id="started_at" value={inputForm.started_at} onChange={handleChange} /> : new Date(inputForm?.started_at).toLocaleDateString('nl-NL')}
                    </div>
                </div>
                {editMode && extraEditModeContent}
            </div>
            <Modal show={isLoading} loadingModal={true}>
                <i className="fa-solid fa-spinner" style={{color: 'white', fontSize: '24px'}}></i> 
            </Modal>
            <Modal show={showExportModal} loadingModal={false} handleClose={handleCloseExportModal} >
                <ProjectExport projectBreakdown={projectBreakdown} totalCosts={totalCosts} totalHours={totalHours} totalKilometers={totalKilometers} projectActivities={projectActivities} />
            </Modal>
        </Fragment>
    )
}

export default ProjectDetails