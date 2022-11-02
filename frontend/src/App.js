import './App.css';
import * as React from "react";
import LogIn from "./pages/Login"
import SignUp from "./pages/SignUp";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import NewDocument from "./pages/NewDocument"
import SearchMenu from "./pages/SearchMenu"
import Results from "./pages/Results"

/*function checkToken() {
  return window.localStorage.getItem('token');

}*/

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<SearchMenu/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/new_document" element={<NewDocument/>}/>
            <Route path="/search_menu" element={<SearchMenu/>}/>
            <Route path="/results" element={<Results/>}/>
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
