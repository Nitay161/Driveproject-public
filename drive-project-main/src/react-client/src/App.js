import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayout';
import FileList from './components/file-components/FileList'
import ViewFile from './components/file-components/ViewFile'
import EditFile from './components/file-components/EditFile'
import CreateFile from './components/file-components/CreateFile'
import Starred from './components/additional/Starred'
import Trash from './components/additional/trash'
import ManagePerms from './components/file-components/ManagePerms'
import MoveToFolder from './components/file-components/MoveToFolder'
import Share from './components/file-components/Share'
import SharedWithMe from './components/additional/SharedWithMe'
import Recent from './components/additional/Recent'
import Search from './components/additional/Search'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;