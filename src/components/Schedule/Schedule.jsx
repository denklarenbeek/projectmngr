import { Fragment, useEffect, useState } from "react"
import Calendar from '../../features/calendar/Calendar'
import Modal from '../../features/modal/Modal'
import ScheduleActivityForm from '../../features/scheduler/ScheduleActivityForm'
import { selectAllActivity } from "../../features/activity/activityApiSlice"
import { useSelector } from "react-redux"

const Schedule = () => {
    const [modal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState('')
    const data = useSelector(selectAllActivity);

    const activities = data.filter(activity => activity.category === 'Planned');
    activities.sort((a, b) =>  new Date(a.createdAt) - new Date(b.createdAt))

    const handleClose = () => {
        setModal(false)
    }
    const showFormModal = () => {
        setModalContent(<ScheduleActivityForm handleClose={handleClose} />)
        setModal(true)
    }

    let content

    content = (
        <Fragment>
            <div className="page__header">
                <h1>SCHEDULE</h1>
                <a style={{display: 'inline-block'}}>
                    <div className="button_create_entity" onClick={showFormModal}>
                    <i className="fa-solid fa-plus"></i>
                        <p>Plan New Activity</p>
                    </div>
                </a>
            </div>
            <Calendar activities={activities} handleClose={handleClose} showModal={() => setModal(true)} setModalContent={setModalContent} />
            <Modal show={modal} handleClose={handleClose}>
                {modalContent}
            </Modal>
        </Fragment>
    )

    return content
}

export default Schedule