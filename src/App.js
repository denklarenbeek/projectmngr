import { Routes, Route } from 'react-router-dom';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/Login/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import { ROLES } from './config/roles';
import './App.css';

import Layout from './components/Layout';
import Public from './components/Public/Public';
import Login from './features/auth/Login/Login';
import DashLayout from './components/DashLayout';
import Welcome from './components/Welcome/Welcome';
import Profile from './components/Profile/Profile';
import ResetpasswordPage from './components/Resetpassword/Resetpassword';

import ProjectForm from './features/projects/ProjectForm';
import Projects from './components/Projects/Projects';
import Project from './components/Project/Project';
import Users from './components/Users/Users';
import Schedule from './components/Schedule/Schedule';
import Activity from './components/Activity/Activity';
import ActivateUser from './components/ActivatieUser/ActivateUser';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* PUBLIC ROUTE FOR EVERBODY VISIBLE*/}
        <Route index element={<Public />} /> 
        <Route path='login' element={<Login />} />
        <Route path='resetpassword'>
          <Route path=':token' element={<ResetpasswordPage />} />
        </Route>
        <Route path='activateuser'>
          <Route path=':token' element={<ActivateUser />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
          <Route element={<Prefetch />}>
            <Route path='dashboard' element={<DashLayout />}> {/* START OF DASHBOARD ROUTE*/}

              <Route index element={<Welcome />} />
              
              <Route path='projects'>
                <Route index element={<Projects />} />
                <Route path='new' element={<ProjectForm />} />
                <Route path=':id' element={<Project />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Administrator, ROLES.SuperUser]} />}>
                <Route path='users'>
                  <Route index element={<Users />} />
                </Route>
              </Route>

              <Route path='profile'>
                <Route index element={<Profile />} />
              </Route>

              <Route path='schedule'>
                <Route index element={<Schedule />} />
              </Route>

              <Route path='activity'>
                <Route index element={<Activity />} />
              </Route>

              </Route>{/*END OF DASHBOARD ROUTE */}


            </Route>
          </Route>
        </Route> {/* END OF PROTECTED ROUTE */}
      </Route>
    </Routes>
  );
}

export default App;
