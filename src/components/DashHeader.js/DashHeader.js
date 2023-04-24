import React from 'react'
import useAuth from '../../hooks/useAuth';

import './DashHeader.css';

const DashHeader = () => {

    const { name, email, picture } = useAuth()

    const content = (
        <header className="dash-header">
            <div className="dash-header__container">
                <div className="searchbar">
                    <input type="text" placeholder='search.....' />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="notifications">
                    <i className="fa-regular fa-bell"></i>
                    <i className="fa-solid fa-circle notifications__alarm active"></i>
                </div>
                <div className="profile">
                    <div className="profile__image">
                        <img src={picture} alt="profile-image" />
                    </div>
                    <div className="profile__information">
                        <p className="profile_name">{name}</p>
                        <p className="profile_company">{email}</p>
                    </div>
                </div>
            </div>

        </header>
    )
    return content
}

export default DashHeader