import * as React from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useParams } from "react-router-dom";

function handleClickDoc(id, navigate) {
    var idClick = new FormData();
    idClick.append("id", id);

    fetch("http://localhost:8080/document/click",{
        method: "POST",
        body: idClick
    }).then(res=>res.json())
    .then((result)=>{
        console.log(result)
        navigate(`/document/${id}`)
    })
}

function QuickSearchResults() {
    let { value } = useParams();
    const [list, setList] = React.useState([])
    var page = 1;

    var form = new FormData();
    form.append("page", page);
    form.append("name", value)

    let navigate = useNavigate();

    React.useEffect(() => { 
        fetch("http://localhost:8080/document/get/documents/by/name",{
                method: "POST",
                body:form
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log(result)
                setList(result.map(doc => (
                    <ListItemButton onClick={() => handleClickDoc(doc.id, navigate)}>
                        <ListItemText primary={doc.name} secondary={doc.files} />
                    </ListItemButton>
                )))
                console.log(list)
            })
    }, []);
        
        
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <List>
                {
                    list
                }
            </List>
        </div>
    )     
}

export default QuickSearchResults