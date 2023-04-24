import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Public = () => {
  return (
    <Fragment>
        <h1>Public Page for people who have no login</h1>
        <Link to='/login' />
    </Fragment>
  )
}

export default Public