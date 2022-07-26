import './App.css';
import * as React from "react";
import LogIn from "./pages/Login"
import SignUp from "./pages/SignUp";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import AddDocument from './pages/AddDocument';

function checkToken() {
  return window.localStorage.getItem('token');

}

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<div/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/add/document" element={<AddDocument/>}/>
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
