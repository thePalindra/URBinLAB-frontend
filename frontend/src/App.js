import './App.css';
import * as React from "react";
import LogIn from "./pages/Login"
import SignUp from "./pages/SignUp";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import AddGeneric from './pages/AddGeneric';
import AddStatistics from './pages/AddStatistics';
import AddDrawings from './pages/AddDrawings';
import AddReports from './pages/AddReports';
import AddPhoto from './pages/AddPhotography';
import AddSensors from './pages/AddSensors';
import AddBaseMaps from "./pages/AddBaseMaps"
import SelectType from './pages/SelectType';
import SelectAerialImage from './pages/SelectAerialImage';
import SelectCartography from './pages/SelectCartography';

/*function checkToken() {
  return window.localStorage.getItem('token');

}*/

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<div/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/generic" element={<AddGeneric/>}/>
            <Route path="/statistics" element={<AddStatistics/>}/>
            <Route path="/drawings" element={<AddDrawings/>}/>
            <Route path="/reports" element={<AddReports/>}/>
            <Route path="/photography" element={<AddPhoto/>}/>
            <Route path="/sensors" element={<AddSensors/>}/>
            <Route path="/base" element={<AddBaseMaps/>}/>
            <Route path="/select/document/type" element={<SelectType/>}/>
            <Route path="/cartography" element={<SelectCartography/>}/>
            <Route path="/aerial_image" element={<SelectAerialImage/>}/>
            {/*<Route path="/search/:value/result" element={<ListDocumentQuickSearchByName/>}/>
            <Route path="/all/documents" element={<AllDocuments/>}/>
            <Route path="/add/document" element={<AddFiles/>}/>
            <Route path="/document/:id" element={<Document/>}/>*/}
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
