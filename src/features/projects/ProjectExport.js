import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProjectById } from './projectsApiSlice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ProjectPDF } from '../../exports/ProjectDetails'
import { CSVLink } from "react-csv";
import './ProjectExport.css'

const ProjectExport = ({totalCosts, totalHours, totalKilometers, projectBreakdown, projectActivities}) => {
    const { id } = useParams();
    const project = useSelector(state => selectProjectById(state, id));
    let activities = []
    
    const formatCSVData = () => {
        const formatedActivities = projectActivities.map(activity => {
            const new_act = { ...activity }
            new_act.project_id = activity.project_id._id
            new_act.owner = activity.owner._id
            delete new_act._id
            return new_act
        });
        activities = formatedActivities
    }

    formatCSVData()

    return (
        <div className="export-modal">
            <div className="form_header">
                <h2>Export Project</h2>
            </div>
            <div className="button-group"> 
                <div className="button_create_entity outline" style={{marginRight: '20px'}}>
                    <i className="fa-solid fa-file-pdf"></i>
                    <PDFDownloadLink document={<ProjectPDF title={project.title} projectBreakdown={projectBreakdown} projectActivities={projectActivities} project={project} totalCosts={totalCosts} totalHours={totalHours} totalKilometers={totalKilometers} />} fileName={`${project.title}-${Date.now()}.pdf`}>
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : 'Download PDF'
                        }
                    </PDFDownloadLink>
                </div>
                <div className="button_create_entity outline">
                    <i className="fa-solid fa-file-csv"></i>
                    <CSVLink data={activities} filename={`project-activities-${Date.now()}`} >Export activities to CSV</CSVLink>
                </div>
            </div>
        </div>
    )
}

export default ProjectExport