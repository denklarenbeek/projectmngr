import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { selectAllProjects } from './projectsApiSlice';
import ProjectItem from './ProjectItem';

import './ProjectList.css';


const ProjectList = ({title}) => {
    //TODO: INVOKE THE USEGETPROJECTS HOOK INSTEAD OF THE SELECTALLPROJECTS
    const projects = useSelector(selectAllProjects);
    const [categoryState, setCategoryState] = useState('active')

    let content;
    content = (
        <div className="project_list_container">
            <div className="table__header">
                <h3>{title}</h3>
            </div>
            <div className="table__container">
                <div className="table__container_tabs">
                    <p className={'category ' + (categoryState === 'draft' ? 'active' : '')} onClick={() => setCategoryState('draft')} >Draft</p>
                    <p className={'category ' + (categoryState === 'active' ? 'active' : '')} onClick={() => setCategoryState('active')}>On Going</p>
                    <p className={'category ' + (categoryState === 'completed' ? 'active' : '')} onClick={() => setCategoryState('completed')}>Completed</p>
                </div>
                <div className="table__container_body">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Value</th>
                                <th>Participants</th>
                                <th>Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => {
                                if(project.status.toLowerCase() === categoryState) {
                                    return <ProjectItem key={project.id} project={project}  />
                                } 
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )


    return content
}

export default ProjectList