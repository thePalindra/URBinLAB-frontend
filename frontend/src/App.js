import './App.css';
import * as React from "react";
import LogIn from "./pages/Login"
import SignUp from "./pages/SignUp";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import AddDocument from "./pages/AddDocument"
import SearchMenu from "./pages/SearchMenu"
import MainPage from "./pages/MainPage"
import Results from "./pages/Results"
import Document from "./pages/Document"
import Lists from "./pages/ProfileLists"

/*function checkToken() {
  return window.localStorage.getItem('token');

}*/

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/new_document" element={<AddDocument/>}/>
            <Route path="/search_menu" element={<SearchMenu/>}/>
            <Route path="/results" element={<Results/>}/>
            <Route path="/document/:id" element={<Document/>}/>
            <Route path="/profile/lists" element={<Lists/>}/>
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
