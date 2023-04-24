import { Fragment, useState } from "react"
import { useSelector } from "react-redux"
import { selectAllActivity } from "../../features/activity/activityApiSlice"
import { useDeleteActivityMutation } from "../../features/activity/activityApiSlice"
import AddGeneralActivityForm from "../../features/activity/AddGeneralActivityForm"
import Modal from "../../features/modal/Modal"

const Activity = () => {

    const activities = useSelector(selectAllActivity);
    const [deleteActivity] = useDeleteActivityMutation();

    const [modal, setModal] = useState(false)

    activities.sort((a, b) =>  new Date(b.createdAt) - new Date(a.createdAt))

    const deleteActivityFromTable =  async (id) => {
        await deleteActivity({id});
    }

    const handleClose = () => {
        setModal(false)
    }

    return (
        <Fragment>
            <div className="page__header">
                <h1>ACTIVITY LOG</h1>
                <a style={{display: 'inline-block'}}>
                    <div className="button_create_entity" onClick={() => setModal(true)} >
                        <i className="fa-solid fa-plus"></i>
                        <p>Create New Activity</p>
                    </div>
                </a>
            </div>
            <div className="project__body__tables">
                <div className="table__container">
                    <table className='logging__table table-bordered'>
                        <thead>
                            <tr>
                                <th style={{width: '22%'}}>Name</th>
                                <th style={{width: '22%'}}>Project</th>
                                <th style={{width: '11%'}} >Type</th>
                                <th style={{width: '11%'}} >Quantity</th>
                                <th style={{width: '11'}} >Start Date</th>
                                <th style={{width: '11%'}} >Create Date</th>
                                <th style={{width: '6%'}} >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities?.map(item => {
                                let projectOrTitle
                                if(item.project_id === undefined || item.project_id === null) {
                                    projectOrTitle = item.title
                                } else {
                                    projectOrTitle = item.project_id?.title
                                }
                                return (
                                    <tr key={item._id}> 
                                        <td>{item.owner?.name}</td>
                                        <td>{projectOrTitle}</td>
                                        <td>{item.category}</td>
                                        <td>{item.quantity}</td>
                                        <td>{new Date(item.start_date).toLocaleDateString('nl-NL')}</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString('nl-NL')}</td>
                                        <td style={{textAlign: 'center'}} >
                                            <i className="fa-regular fa-trash-can table__actions_item" onClick={() => deleteActivityFromTable(item._id)} ></i>
                                        </td>   
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal show={modal} handleClose={handleClose}>
                <AddGeneralActivityForm handleClose={handleClose} />
            </Modal>
        </Fragment>
    )
}

export default Activity