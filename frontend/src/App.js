import './App.css';
import * as React from "react";
import Header from "./components/Header"
import Document from "./pages/Document"
import AllDocuments from "./pages/AllDocuments"
import AddFiles from "./pages/AddFiles"
import ListDocumentQuickSearchByName from "./pages/ListDocumentQuickSearchByName"
import LogIn from "./pages/Login"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

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
