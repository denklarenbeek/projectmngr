import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode'

const useAuth = () => {

    const token = useSelector(selectCurrentToken)
    let isSuperUser = false
    let isManager = false
    let isAdmin = false
    let status = 'User'

    if(token) {
        const decoded = jwtDecode(token)
        const {email, name, roles, picture, id, customer, color} = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Administrator')
        isSuperUser = roles.includes('SuperUser')

        if(isManager) status = 'Manager'
        if(isAdmin) status = 'Administrator'
        if(isSuperUser) status = 'SuperUser'

        return {id, email, name, roles, picture, status, isManager, isAdmin, isSuperUser, color, customer }

    }

    return {id: '', email: '', roles: [], name: '', picture: '', status, isManager, isAdmin, isSuperUser, color: '' }

}

export default useAuth