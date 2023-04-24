import React, {Fragment, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectProjectById } from '../../features/projects/projectsApiSlice';
import { selectAllActivity } from '../../features/activity/activityApiSlice';

import LoggingTable from '../../features/activity/LogginTable/LoggingTable';
import ProjectChart from '../../features/chart/ProjectChart';

import { formatCurrency } from '../../helpers/formatting';
import { pluck } from '../../helpers/helpers';
import { sumUpConditional } from '../../helpers/helpers';


import './Project.css';
import ProjectDetails from '../../features/projects/ProjectDetails';
import { selectAllUsers } from '../../features/users/usersApiSlice';

const Project = () => {
  const { id } = useParams();
  const project = useSelector(state => selectProjectById(state, id));
  const [totalHours, setTotalHours] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalKilometers, setTotalKilometers] = useState(0);
  const [totalTravelHours, setTotalTravelHours] = useState(0);

  const data = useSelector(selectAllActivity);
  const activities = data.filter(activity => activity.category !== 'Planned')
  const users = useSelector(selectAllUsers)

  const [projectActivities, setProjectActivities] = useState([]);

  const [projectValue, setProjectValue] = useState(0);
  const [projectParticipants, setProjectParticipants] = useState([])
  const [projectIsCompleted, setProjectIsCompleted] = useState(project?.status === 'Completed')

  const [showProjectCharts, setShowProjectCharts] = useState(false)


  const [modal, setModal] = useState(false)

  const handleClose = () => {
      setModal(false)
  }


  let userNames
  if(project) {
    userNames = pluck(project?.participants, '_id')
  }
  let projectBreakdown = []
  userNames?.map((name) => {
      const userObj = {};
      userObj.fullname = users.find((user) => user._id === name)?.name;
      userObj.totalHours = sumUpConditional(projectActivities, {
          id: name,
          category: "Hours",
      });
      userObj.totalCosts = sumUpConditional(projectActivities, {
          id: name,
          category: "Costs",
      });
      userObj.totalKM = sumUpConditional(projectActivities, {
          id: name,
          category: "Kilometers",
      });
      userObj.totalTravelHours = sumUpConditional(projectActivities, {
          id: name,
          category: "Travel Hours",
      });
      userObj.kmFee = userObj.totalKM * 0.19;
      let projectsplit = project.value - totalCosts - totalKilometers * 0.19;
      let totalProjectHours = totalHours + totalTravelHours;
      let totalUserProjectHours = userObj.totalHours + userObj.totalTravelHours;
      userObj.projectsplit =
          (projectsplit / totalProjectHours) * totalUserProjectHours;
      userObj.projectsplit = (projectsplit / totalHours) * userObj.totalHours;
      userObj.totalSplit =
          userObj.projectsplit + userObj.totalCosts + userObj.kmFee;
      projectBreakdown.push(userObj);
  });

  const toggleCharts = () => {
    if(showProjectCharts) {
      setShowProjectCharts(false)
    } else {
      setShowProjectCharts(true)
    }
  }

  useEffect(() => {
    setProjectValue(project?.value)
    if(project?.status === 'Completed'){
      setProjectIsCompleted(true)
    }
    const editedParticipants = project?.participants.map(participant => {
      return {
        value: participant._id,
        label: participant.name
      }
    })
    setProjectParticipants(editedParticipants);
  }, [project])

  useEffect(() => {
    const workingHours = activities.filter((item) => item.project_id?._id === id && item.category === 'Hours');
    const totalOfWorkingHours = workingHours.reduce((prev, cur) => prev + cur.quantity, 0);
    setTotalHours(totalOfWorkingHours);
    const costs = activities.filter((item) => item.project_id?._id === id && item.category === 'Costs');
    const totalCosts = costs.reduce((prev, cur) => prev + cur.quantity, 0);
    setTotalCosts(totalCosts);
    const kilometers = activities.filter((item) => item.project_id?._id === id && item.category === 'Kilometers');
    const totalKilometers = kilometers.reduce((prev, cur) => prev + cur.quantity, 0);
    setTotalKilometers(totalKilometers);
    const travelhours = activities.filter((item) => item.project_id?._id === id && item.category === 'Travel Hours');
    const totalTravelHours = travelhours.reduce((prev, cur) => prev + cur.quantity, 0);
    setTotalTravelHours(totalTravelHours)
    const projectActObj = activities.filter((item) => item.project_id?._id === id)
    setProjectActivities(projectActObj)
  }, [id, data])

  let content

  if(project) {
    content = (
      <Fragment>
        {showProjectCharts && (
          <ProjectChart
            project={project}
            projectActivities={projectActivities}
            userNames={userNames}
            projectBreakdown={projectBreakdown}
          />
        )}
        <ProjectDetails
          project={project}
          setProjectValue={setProjectValue}
          setProjectParticipants={setProjectParticipants}
          setProjectIsCompleted={setProjectIsCompleted}
          projectIsCompleted={projectIsCompleted}
          showProjectCharts={showProjectCharts}
          toggleCharts={toggleCharts}
          totalHours={totalHours}
          totalCosts={totalCosts}
          totalKilometers={totalKilometers}
          projectActivities={projectActivities}
          projectBreakdown={projectBreakdown}
        />
        <div className="project__body">
          <div className="project__body__category">
            <p>Total Hours</p>
            <h3>{totalHours} hours</h3>
          </div>
          <div className="project__body__category">
            <p>Total Kilometers</p>
            <h3>{totalKilometers} km</h3>
          </div>
          <div className="project__body__category">
            <p>Total Costs</p>
            <h3>€ {formatCurrency(totalCosts)}</h3>
          </div>
          <div className="project__body__category">
            <p>Total value</p>
            <h3>€ {formatCurrency(projectValue)}</h3>
          </div>
        </div>
        <div className="project__body__tables">
          <LoggingTable
            activities={projectActivities}
            title={true}
            projectIsCompleted={projectIsCompleted}
          />
        </div>
      </Fragment>
    );
  }

    return content;
}

export default Project