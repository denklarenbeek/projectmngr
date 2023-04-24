import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import './Public.css'

const Public = () => {
  return (
    <div className="public-html">
        <div className="public-body">
            <h1>Project MNGR</h1>
            <div className="button-container">
                <Link className='public-button' to='/login' >LOGIN</Link>
            </div>
        </div>
    </div>
  )
}

export default Public