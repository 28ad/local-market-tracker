import Home from "./pages/Home";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import Favourites from "./pages/Favourites";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import CMS from "./pages/CMS";
import CMSHome from "./pages/CMSHome";
import CMSProtectedRoutes from "./components/CMSProtectedRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AuthProtectedRoutes from './components/AuthProtectedRoutes';


import { Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <>
      
      <Routes>

      <Route path="/" element={<Home/>}/>

      <Route element={<AuthProtectedRoutes/>}>
        <Route path="/cms" element={<CMS/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} /> 

        {/* main app protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/favourites" element={<Favourites/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/account" element={<Account/>}/>
        </Route>

        {/* CMS protected routes */}
        <Route element={<CMSProtectedRoutes />}>
          <Route path="/cms/home" element={<CMSHome/>}/>
        </Route>
      </Routes>

    </>
  )
}

export default App
