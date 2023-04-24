import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectProjectById } from '../../projects/projectsApiSlice';

import LoggingTableRow from './LoggingTableRow';
import AddActivityForm from '../AddActivityForm';
import Modal from '../../modal/Modal';

import './LoggingTable.css';

const LoggingTable = ({activities, title, projectIsCompleted}) => {
    const { id } = useParams()
    const project = useSelector(state => selectProjectById(state, id))
    activities.sort((a, b) =>  new Date(b.start_date) - new Date(a.start_date))
    
    const [modal, setModal] = useState(false);
    const [sortedActivities, setSortedActivities] = useState(activities) 

    const handleClose = () => {
        setModal(false);
    }

    useEffect(() => {
        if(activities) {
            activities.sort((a, b) =>  new Date(b.start_date) - new Date(a.start_date))
            setSortedActivities(activities)
        }
    }, [activities])


    const sortTable = (e) => {
        const {id: category} = e.target
        const actObj = [...sortedActivities]
        if(e.target.id === 'start_date' || e.target.id === 'end_date'){
            actObj.sort((a, b) =>  new Date(a[category]) - new Date(b[category]))
        } else if (category === 'quantity') {
            console.log('sort', category)
            actObj.sort((a, b) =>  b[category] - a[category])
        } else if (category === 'name'){
            console.log('sort', category)
            actObj.sort((a, b) => { // eslint-disable-line
                const nameA = a.owner.name.toUpperCase(); // ignore upper and lowercase
                const nameB = b.owner.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
            })
        }  else {
            console.log('sort', category)
            actObj.sort((a, b) => { // eslint-disable-line
                const nameA = a[category].toUpperCase(); // ignore upper and lowercase
                const nameB = b[category].toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
            })
        }
        setSortedActivities(actObj)
    }

    let content

    content = (
        <div className="table__container">
            <div className="page__header page_title">
                {title && <h3>Activity Log</h3>}
                {!projectIsCompleted && <a  style={{display: 'inline-block'}}>
                    <div className="button_create_entity" onClick={() => setModal(true)}>
                        <i className="fa-solid fa-plus"></i>
                        <p>Add New Activity</p>
                    </div>
                </a>}
            </div>
            <table className='logging__table table-bordered'>
            <thead>
                <tr>
                    <th style={{width: '22%'}} >Name <i className="fa-solid fa-sort" id='name' onClick={sortTable}></i> </th>
                    <th style={{width: '22%'}} >Type <i className="fa-solid fa-sort" id='category' onClick={sortTable}></i></th>
                    <th style={{width: '11%'}} >Quantity <i className="fa-solid fa-sort" id='quantity' onClick={sortTable}></i></th>
                    <th>Start Date <i className="fa-solid fa-sort" id='start_date' onClick={sortTable}></i></th>
                    <th>End Date <i className="fa-solid fa-sort" id='end_date' onClick={sortTable}></i></th>
                    {!projectIsCompleted && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {sortedActivities?.map(row => {
                    return <LoggingTableRow key={row.id} item={row} projectIsCompleted={projectIsCompleted} />
                })}
            </tbody>
        </table>
        <Modal show={modal} handleClose={handleClose}>
            <AddActivityForm handleClose={handleClose} projectId={project.id} />
        </Modal>
    </div>
    )
    return content
}

export default LoggingTable