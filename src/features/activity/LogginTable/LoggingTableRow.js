import React from 'react'
import { useDeleteActivityMutation } from '../activityApiSlice';

const LoggingTableRow = ({item, projectIsCompleted}) => {

  const [deleteActivity] = useDeleteActivityMutation();

  const deleteActivityFromTable =  async (id) => {
    await deleteActivity({id});
}

  return (
    <tr>
        <td>{item.owner.name}</td>
        <td>{item.category}</td>
        <td>{item.quantity}</td>
        <td>{new Date(item.start_date).toLocaleDateString('nl-NL')}</td>
        <td>{new Date(item.end_date).toLocaleDateString('nl-NL')}</td>
        <td>
            {!projectIsCompleted && <i className="fa-regular fa-trash-can table__actions_item" onClick={() => deleteActivityFromTable(item._id)}></i> }
        </td>
    </tr>
  )
}

export default LoggingTableRow