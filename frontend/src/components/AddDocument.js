import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

let lat = 0
let lng = 0
let size = 0

function circle(e) {
    let result =  "c"
    console.log(result)
    
    lng = e.layer._latlng.lng
    lat = e.layer._latlng.lat 
    size = e.layer._mRadius
    return result;
}

function point(e) {
    let result = ["POINT","(" + e.layer._latlng.lng, e.layer._latlng.lat + ")"].join(" ")
    console.log(result)
    return result;
}

function polygon(e) {
    let result = "POLYGON (("
    for (let i = 0; i < e.layer._latlngs[0].length; i++)
        result = [result + e.layer._latlngs[0][i].lng, e.layer._latlngs[0][i].lat + ","].join(" ")
    
    result = [result + e.layer._latlngs[0][0].lng, e.layer._latlngs[0][0].lat + "))"].join(" ")
    console.log(result)
    return result;
}

function polygonAux(origin, limit) {
    let res = "POLYGON (("
    res = [res+origin[0],origin[1]+","].join(" ")
    res = [res+origin[0],limit[1]+","].join(" ")
    res = [res+limit[0],limit[1]+","].join(" ")
    res = [res+limit[0],origin[1]+","].join(" ")
    res = [res+origin[0],origin[1]+"))"].join(" ")
    return res;
}

function range(min, max, step) {
    var len = max - min + 1;
    var arr = new Array(len);
    for (var i=0; i<len; i+=step) {
      arr[i] = (min + i).toString();
    }
    return arr;
}


export default function Default() {
    let navigate = useNavigate()
    const color_list = ["rgba(228,38,76,255)", "rgba(121,183,46,255)", "rgba(247,166,20,255)", "rgba(3,137,173,255)"]
    const [color, set_color]=React.useState("")
    const [files, set_files]=React.useState([])
    const [tags, set_tags]=React.useState([]);
    const [modal1, set_modal1]=React.useState(false);

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) {
            get_color()
        }
        return () => { ignore = true; }
    },[]);

    function get_color() {
        let res = Math.floor(Math.random() * color_list.length)
        if (color_list[res] === color)
            get_color()
        else
            set_color(color_list[res])
    }
    
    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{
                    margin: "auto",
                    position: "relative",
                    border: "1px solid grey",
                    background: "rgba(256, 256, 256, 0.9)",
                    height: "8vh",
                    minHeight: "50px",
                    width:"120%",
                    left: "-10%",
                }}>  
                <Tooltip
                    title="Cancelar">
                    <IconButton
                        style={{
                            background: "rgba(228,38,76,255)",
                            marginLeft: "-8.3%",
                            height: "50px",
                            width: "50px"
                        }} 
                        onClick={()=> {
                            navigate(`/`)
                        }}>
                        <ClearIcon
                            style={{
                                color: "rgba(256, 256, 256, 0.9)"}}/>
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title="Concluir processo de adicionar documentos">
                    <IconButton
                        style={{
                            background: "rgba(121,183,46,255)",
                            left: "10%",
                            height: "50px",
                            width: "50px"
                        }} 
                        onClick={()=> {
                            set_modal1(true)
                        }}>
                        <CheckIcon
                            style={{
                                color: "rgba(256, 256, 256, 1)"}}/>
                    </IconButton>
                </Tooltip>
            </Box>
            <div 
                style={{ 
                    margin: "auto",
                    position: "relative",
                    background: "rgba(256, 256, 256, 0.9)",
                    height: "84vh",
                    width:"100%",
                    }}>
                <div
                    style={{
                        height: "100%",
                        width: "40%",
                        position: "relative",
                        float: "left",
                        border: "1px solid grey",
                    }}>
                    Meta informação
                </div>
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        width:"30%",
                        float: "left",
                    }}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            top: "2vh",
                        }}>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "65%"
                            }}>
                            Adicionar ficheiros
                        </Typography>
                    </Box>
                    <Box 
                        style={{   
                            margin: "auto",
                            position: "relative",
                            paddingTop: "5vh",
                            }}>
                        <Button
                            variant="contained"
                            component="label"
                            style={{ 
                                margin:"auto",
                                width: "30%",
                            }}>
                            Upload
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e)=> {
                                    let arr = [...files]
                                    for (let i = 0; i<e.target.files.length; i++) {
                                        let current = e.target.files[i]
                                        if (!arr.find(file=> file.name===current.name))
                                            arr.push(e.target.files[i])
                                    }
                                    set_files(arr)
                                    console.log(arr)
                                }}/>
                        </Button>
                    </Box>
                    <List
                        style={{
                            top: "2.5vh",
                            overflow: "auto",
                            height: "76vh"
                        }}>
                        {files?.length && files.map((doc, index) => {
                            return(
                                <div 
                                    key={index}
                                    style={{
                                        height: "12vh",
                                        border: "1px solid grey",
                                    }}>
                                    <Box>
                                        <Typography 
                                            variant="h7" 
                                            style={{ 
                                                color: "rgba(0, 0, 0, 0.9)",
                                                maxWidth: "85%",
                                                float: "left",
                                                marginLeft: "2%",
                                                textAlign: "left"
                                            }}>
                                            {doc.name}
                                        </Typography>
                                        <Tooltip
                                            title="Remover ficheiro">
                                            <IconButton 
                                                edge="end" 
                                                aria-label="delete" 
                                                style={{
                                                    float: "right",
                                                    right: "6%"
                                                }}
                                                onClick={()=>{
                                                    let aux = [...files]
                                                    aux.splice(index, 1)
                                                    set_files(aux)
                                                }}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </div>
                            )
                        })}
                    </List>
                </div>
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        width:"30%",
                        float: "left",
                        border: "1px solid grey",
                    }}>
                    Lista de keywords
                </div>
            </div>
        </>

    );
}