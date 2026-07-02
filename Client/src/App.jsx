import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Project from './pages/Project'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'

//protect
import ProtectedRoute from './components/ProtectedRoute'
import ManageServices from './pages/admin/ManageServices'
import ManageProjects from './pages/admin/ManageProjects'
import ManageAbout from './pages/admin/ManageAbout'
import ManageHeros from './pages/admin/ManageHeros'
import ContactMessages from './pages/admin/ContactMessages'
import Setting from './pages/admin/Settings'

function App() {
  return (
    <>
      <Routes>

        {/* USER ROUTES  */}
        <Route element={<UserLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/projects' element={<Project />} />
          <Route path='/contact' element={<Contact />} />
        </Route>

        {/* ADMIN LOGIN  */}
        <Route path='/admin/login' element={<AdminLogin />} />

        {/* {protected admin route} */}
        <Route path='/admin'
          element={
            <ProtectedRoute>
              <AdminLayout />  {/* protected route ke andar admin layout  */}

            </ProtectedRoute>
          }
        >
          {/* ADMIN ROUTES  */}
          
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='hero' element={<ManageHeros />} />
          <Route path='about' element={<ManageAbout />} />
          <Route path='projects' element={<ManageProjects />} />
          <Route path='services' element={<ManageServices />} />
          <Route path='contact' element={<ContactMessages />} />
          <Route path='settings' element={<Setting />} />
          
        </Route>



      </Routes>
    </>
  )
}

export default App