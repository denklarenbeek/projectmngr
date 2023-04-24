import React from 'react'
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../helpers/formatting';

const ProjectItem = ({project}) => {
    const {participants} = project;
    const navigate = useNavigate();
    let initials = [];

    participants.map(participant => {
        const split = participant.name?.split(' ');

        let characters = ''
        for(let part in split) {
            const x = split[part].substring(0,1);
            characters += x;
        }
        let participantObject = {
            name: participant.name,
            initials: characters
        }
        initials.push(participantObject);
    });

    return (
        <tr onClick={() => navigate(`/dashboard/projects/${project.id}`)}>
            <td>{project.title}</td>
            <td>€  {formatCurrency(project.value)}</td>
            <td className='table__column_initial' >
                {initials.map(initial => (
                    <div key={initial.initials} className="initial_container">
                        <span className='initial' >{initial.initials}</span>
                        {/* <span className="tooltip">{initial.name}</span> */}
                    </div>
                ))}
            </td>
            <td>{project.owner.name}</td>
        </tr>
    )
}

export default ProjectItem