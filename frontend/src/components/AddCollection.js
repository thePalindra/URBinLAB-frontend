import * as React from 'react';
import Button from '@mui/material/Button';
import { Container , TextField, Input} from '@mui/material';


export default function BasicTextFields() {
    const [files, setFiles]=React.useState('');
    const [name, setName]=React.useState('');
    
    const addFile= async (e)=> {
        e.preventDefault();
        var inputdoc = {};
        var inputfile = {};
        var input = {}
        var form = new FormData();

        input["name"] = name;
        input["whoAdded"] = 1;

        await fetch("http://localhost:8080/collection/create",{
            method: "POST",
            headers: {"Content-Type": "application/json"}, 
            body:JSON.stringify(input)
        }).then(res=>res.json())
        .then((result)=>{
            inputdoc["collection"] = result;
        })
        
        for (let i = 0; i < files.length; i++) { 
            var file = files[i]
            
            inputdoc["name"] = file.name.split('.').slice(0, -1).join('.');
            inputdoc["flag"] = true;
            inputdoc["whoAdded"] = 1; 

            await fetcher(file, inputdoc, inputfile, form);           
        }       
    
    }
    
    async function fetcher(file, inputdoc, inputfile, form) {

        await fetch("http://localhost:8080/document/add",{
            method: "POST",
            headers: {"Content-Type": "application/json"}, 
            body:JSON.stringify(inputdoc)
        })
        .then(res=>res.json())
        .then(async (result)=>{
            const docId = result
            console.log(docId)

            form.append("file", file, file.name)

            await fetch("http://localhost:8080/file/attach",{
                method: "POST",
                body: form
            })
            .then(res=>res.json())
            .then(async (result)=>{
                const fileId = result

                inputfile["format"] = "." + file.name.split('.').pop();
                inputfile["creationDate"] = new Date(file.lastModified);
                inputfile["id"] = fileId
                inputfile["document"] = docId

                await fetch("http://localhost:8080/file/add",{
                    method: "POST",
                    headers: {"Content-Type": "application/json"}, 
                    body: JSON.stringify(inputfile)
                })
                .then(res=>res.json())
                .then((result)=>{
                    console.log(result)
                })
            })
            
        })
    };
    return (
        <Container>
            <div>
                <input type="file" id="file" directory="" webkitdirectory="" onChange={(e)=>setFiles(e.target.files)}/>
            </div>
            <br></br>
            <div>
                <form>
                    <TextField id="name" label="Nome" variant="outlined" value = {name}
                    onChange={(e)=>setName(e.target.value)}/>
                        
                </form>
            </div>
            <br></br>
            <div>   
                <Button variant="contained" onClick={addFile}>Add Collection</Button>
            </div>
        </Container>
    );
}
