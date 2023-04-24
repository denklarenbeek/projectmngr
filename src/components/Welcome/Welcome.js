import React, { Fragment, useState} from 'react'
import ProjectList from '../../features/projects/ProjectList';
import { projects } from './Projects'
import Modal from '../../features/modal/Modal';

import './Welcome.css';
import ProjectForm from '../../features/projects/ProjectForm';

const Welcome = () => {

    const [modal, setModal] = useState(false)

    const handleClose = () => {
        setModal(false)
    }

    const content = (
        <Fragment>
            <div className="page__header">
                <h1>DASHBOARD</h1>
                <a style={{display: 'inline-block'}}>
                    <div className="button_create_entity" onClick={() => setModal(true)} >
                    <i className="fa-solid fa-plus"></i>
                        <p>Create New Project</p>
                    </div>
                </a>
            </div>
            <ProjectList projects={projects} title='Project summary last 20 projects'/>
            <Modal show={modal} handleClose={handleClose}>
                <ProjectForm handleClose={handleClose} />
            </Modal>
        </Fragment>
    )

  return content;
}

export default Welcome