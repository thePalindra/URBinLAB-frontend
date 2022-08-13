import * as React from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from "react-router-dom";

function handleClick(id, navigate) {
    let idClick = new FormData();
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

function ListingDocument() {
    const [list, setList] = React.useState([])
    let page = 1;

    let form = new FormData();
    form.append("page", page);

    let navigate = useNavigate();

    React.useEffect(() => {
        fetch("http://localhost:8080/document/get/all",{
                method: "POST",
                body:form
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log(result)
                setList(result.map(doc => (
                    <ListItemButton onClick={() => handleClick(doc.id, navigate)}>
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

export default ListingDocument