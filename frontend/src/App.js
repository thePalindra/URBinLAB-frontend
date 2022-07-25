import './App.css';
import * as React from "react";
//import Login from './components/Login';
import NavBar from "./components/NavBar"
import Document from "./pages/Document"
import AllDocuments from "./pages/AllDocuments"
import AddFiles from "./pages/AddFiles"
import ListDocumentQuickSearchByName from "./pages/ListDocumentQuickSearchByName"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <NavBar/>
          <Routes>
            <Route path="/"/>
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
