import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../../features/projects/ProjectForm'
import Modal from '../../features/modal/Modal'
import { formatCurrency } from '../../helpers/formatting'
import { selectAllProjects } from '../../features/projects/projectsApiSlice'

const Projects = () => {
    const projects = useSelector(selectAllProjects);
    const [modal, setModal] = useState(false)
    const navigate = useNavigate();

    const handleClose = () => {
        setModal(false)
    }

    return (
        <Fragment>
            <div className="page__header">
                <h1>Projects</h1>
                <a style={{display: 'inline-block'}}>
                    <div className="button_create_entity" onClick={() => setModal(true)} >
                        <i className="fa-solid fa-plus"></i>
                        <p>Create New Project</p>
                    </div>
                </a>
            </div>
            <div className="project__body__tables">
                <div className="table__container">
                    <table className='logging__table table-bordered'>
                        <thead>
                            <tr>
                                <th style={{width: '22%'}} >Project</th>
                                <th style={{width: '8%'}} >Value</th>
                                <th style={{width: '8%'}} >Hours</th>
                                <th style={{width: '8%'}} >Costs</th>
                                <th style={{width: '8%'}} >Travel (H)</th>
                                <th style={{width: '8%'}} >KM</th>
                                <th style={{width: '10%'}} >Status</th>
                                <th style={{width: '10%'}} >Last Changed</th>
                                <th style={{width: '10%'}} >Create Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects?.map(item => {
                                return (
                                    <tr key={item._id} onClick={() => navigate(`/dashboard/projects/${item._id}`)} > 
                                        <td>{item.title}</td>
                                        <td>€ {formatCurrency(item.value, 0)}</td>
                                        <td>{item.totals.totalHours}</td>
                                        <td>€ {formatCurrency(item.totals.totalCosts, 0)}</td>
                                        <td>{item.totals.totalTravelHours}</td>
                                        <td>{item.totals.totalKM}</td>
                                        <td>{item.status}</td>
                                        <td>{new Date(item.updatedAt).toLocaleDateString('nl-NL')}</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString('nl-NL')}</td>  
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>     
            <Modal show={modal} handleClose={handleClose}>
                <ProjectForm handleClose={handleClose} />
            </Modal>
        </Fragment>
    )
}

export default Projects