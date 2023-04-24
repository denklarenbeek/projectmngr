import React, {useEffect} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSendLogoutMutation } from '../../features/auth/authApiSlice';
import useAuth from '../../hooks/useAuth';

import './Sidebar.css';

// const DASH_REGEX = /^\dashboard(\/)?$/
// const PROJECTS_REGEX = /^\dashboard\/projects(\/)?$/
// const USERS_REGEX = /^\dashboard\/users(\/)?$/
// const ACTIVITY_REGEX = /^\dashboard\/activity(\/)?$/

const Sidebar = ({sideBarOpen, handleSidebarDisplay}) => {

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { isAdmin, isManager, isSuperUser } = useAuth()

    const [sendLogout, {isLoading, isSuccess, isError, error}] = useSendLogoutMutation()

    useEffect(() => {
        if(isSuccess) navigate('/')
    },[isSuccess, navigate])

    const onLogOutClicked = (e) => {
        e.preventDefault()
        sendLogout()
    }

    const settingsContent = () => {
        if(isSuperUser || isAdmin || isManager) {
            return (
                <Link to='/dashboard/users'>
                    <div className={`sidebar__menu_item ${pathname.endsWith('users') ? 'active' : ''}`}>
                        <i className="fa-solid fa-user"></i>
                        {sideBarOpen && <p>Users</p>}
                    </div>
                </Link>
            )
        }
    }

    if(isLoading) return <p>Loading....</p>

    if(isError) return <p>Error: {error.data?.message}</p>

    return (
        <div id='sidebar' >
            <div className="sidebar__header">
                {sideBarOpen &&
                    <Link to='/dashboard' style={{display: 'flex'}}>
                        <div className="sidebar__header_logo">Projectmngr</div>
                    </Link>
                }
                <div className="sidebar__header_icon" onClick={handleSidebarDisplay} >
                    {sideBarOpen &&
                        <i className="fa-solid fa-chevron-left sidebar__header_icon_arrow"></i>
                    }
                    <i className="fa-solid fa-bars"></i>
                </div>
            </div>
            <div className="sidebar__menu">
                <Link to='/dashboard'>
                    <div className={`sidebar__menu_item ${pathname.endsWith('dashboard') ? 'active' : ''}`}>
                        <i className="fa-solid fa-house"></i>
                        {sideBarOpen && <p>Dashboard</p>}   
                        
                    </div>
                </Link>
                <Link to='/dashboard/projects'>
                    <div className={`sidebar__menu_item ${pathname.endsWith('projects') ? 'active' : ''}`}>
                        <i className="fa-solid fa-database"></i>
                        {sideBarOpen && <p>Projects</p>}
                    </div>
                </Link>
                <Link to='/dashboard/schedule'>
                    <div className={`sidebar__menu_item ${pathname.endsWith('schedule') ? 'active' : ''}`}>
                        <i className="fa-solid fa-calendar-days"></i>
                        {sideBarOpen && <p>Agenda</p>}
                    </div>
                </Link>
                
                <Link to='/dashboard/activity'>
                    <div className={`sidebar__menu_item ${pathname.endsWith('activity') ? 'active' : ''}`}>
                        <i className="fa-solid fa-chart-line"></i>
                        {sideBarOpen && <p>Activity</p>}
                    </div>
                </Link>
                <div className="break"></div>
                {sideBarOpen && <h3>Settings</h3>}
                {settingsContent()}
                <Link to='/dashboard/profile'>
                    <div className={`sidebar__menu_item ${pathname.endsWith('profile') ? 'active' : ''}`}>
                        <i className="fa-regular fa-id-card"></i>
                        {sideBarOpen && <p>Profile</p>}   
                    </div>
                </Link>
                <a to='/' onClick={onLogOutClicked}>
                    <div className={`sidebar__menu_item`}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        {sideBarOpen && <p>Logout</p>}   
                    </div>
                </a>
            </div>
        </div>
    )
}

export default Sidebar