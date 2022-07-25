import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function BasicTextFields() {
    const [files, setFile]=React.useState('');

    const addFile= async (e)=>{
        e.preventDefault();

        for (let i = 0; i < files.length; i++) { 
            var file = files[i]

            var form = new FormData()
            form.append("collection", 1)
            form.append("researcher", 1)
            form.append("name", file.name.split('.').slice(0, -1).join('.'))
            form.append("description", "")
            form.append("type", "")
            form.append("provider", "")
            form.append("start", new Date())
            form.append("end", new Date())
            form.append("spaceName", "")
            form.append("spaceType", "")
            form.append("public", true)
            form.append("format", "." + file.name.split('.').pop())
            form.append("creation", new Date(file.lastModified))
            form.append("file", file)

            fetch("http://localhost:8080/file/add",{
                method: "POST",
                body: form
            })
            .then((result)=>{

                console.log(result)
            })       
        }       

    }
    return (
        <Container>
            <div>
                <input type="file" onChange={(e) => setFile(e.target.files)} multiple/>
            </div>
            <br></br>
            <div>
                <Button variant="contained" onClick={addFile}>Add File</Button>
             </div>
        </Container>
    );
    }