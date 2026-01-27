import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './MainLayout';
import FileList from './components/file-components/FileList';
import ViewFile from './components/file-components/ViewFile';
import EditFile from './components/file-components/EditFile';
import CreateFile from './components/file-components/CreateFile';
import Starred from './components/additional/Starred';
import Trash from './components/additional/trash';
import ManagePerms from './components/file-components/ManagePerms';
import MoveToFolder from './components/file-components/MoveToFolder';
import Share from './components/file-components/Share';
import SharedWithMe from './components/additional/SharedWithMe';
import Recent from './components/additional/Recent';
import Search from './components/additional/Search';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const ProtectedRoute = ({ token }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login setToken={saveToken} />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute token={token} />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<FileList />} />
              <Route path="recent" element={<Recent />} />
              <Route path="sharedwithme" element={<SharedWithMe />} />
              <Route path="starred" element={<Starred />} />
              <Route path="trash" element={<Trash />} />
              <Route path="search" element={<Search />} />
              <Route path="create" element={<CreateFile />} />
              <Route path="view/:id" element={<ViewFile />} />
              <Route path="edit/:id" element={<EditFile />} />
              <Route path="move/:id" element={<MoveToFolder />} />
              <Route path="share/:id" element={<Share />} />
              <Route path="manageperms/:id" element={<ManagePerms />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;