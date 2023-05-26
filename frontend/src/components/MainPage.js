import React from "react";
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { createFilterOptions } from '@mui/material/Autocomplete';

import { MapContainer, TileLayer, GeoJSON, FeatureGroup, useMap } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"

let lat = 0
let lng = 0
let size = 0

function circle(e) {
    let result =  "c"
    
    lng = e.layer._latlng.lng
    lat = e.layer._latlng.lat 
    size = e.layer._mRadius
    return result;
}

function point(e) {
    let result = ["POINT","(" + e.layer._latlng.lng, e.layer._latlng.lat + ")"].join(" ")
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

export default function Default() {
    let navigate = useNavigate()
    const OPTIONS_LIMIT = 20;
    const defaultFilterOptions = createFilterOptions();

    const [editable_FG, set_editable_FG] = React.useState(null);
    const [position, set_position]=React.useState([39.7, -9.3])
    const [zoom, set_zoom]=React.useState(7)
    
    const [doc_space, set_doc_space]=React.useState(<></>);
    const [space, set_space]=React.useState(<></>);
    const [drawn, set_drawn]=React.useState(null);
    
    const [layer_type, set_layer_type]=React.useState([]);
    const [doc_before, set_doc_before]=React.useState(-1);
    
    const [search, set_search]=React.useState('');
    const [dictionary, set_dictionary]=React.useState([])
    const [temp_dictionary, set_temp_dictionary]=React.useState([])

    const [all_spaces, set_all_spaces]=React.useState([])
    const [temp_all_spaces, set_temp_all_spaces]=React.useState([])
    const [space_name, set_space_name]=React.useState("");
    const [aux_space_name, set_aux_space_name]=React.useState("");

    const [search_type, set_search_type]=React.useState([]);
    const [default_space, set_default_space]=React.useState(false);

    const [results, set_results]=React.useState([])
    const [page, set_page]=React.useState(100)

    const [modal1, set_modal1]=React.useState(false)

    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("A");
            if (ignore) {
                get_dictionary()
                get_spaces()
            } else {
                navigate(`/login`)
            }
            return () => { ignore = true; }
        }
        start()
    },[]);

    React.useEffect(() => {
        let temp = [...search_type]
        temp = temp.filter(function (letter) {
            return letter != 3;
        });
        if (default_space)
            temp.push(3)
            
        set_search_type(temp)
    }, [default_space]);

    function get_dictionary() {
        fetch("http://urbingeo.fa.ulisboa.pt:5050/dictionary", {
            method: "GET"
        })
        .then(res=>res.json())
        .then(result=>{
            set_dictionary(result)
        });
    }

    async function get_spaces() {
        let res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/space/get_spaces", {
            method: "GET"
        })
        res = await res.json();
        set_all_spaces(res)
    }
        
    async function check_token(type) {
        let form = new FormData();
        form.append("type", type)
        form.append("token", window.localStorage.getItem("token"))

        let res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/token/check", {
            method: "POST",
            body: form
        })

        return res.ok
    }

    const filterOptions = (options, state) => {
        return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
    }

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        set_editable_FG(reactFGref);
    }

    function removeDuplicates(arr) {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }

    function _created(e) {
        set_default_space(true)
        const drawnItems = editable_FG._layers;
        if (Object.keys(drawnItems).length > 1) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editable_FG.removeLayer(layer);
            });
        }
        let parse = require('wellknown');
        switch(e.layerType) {
            case "circle":
                set_drawn(circle(e))
                let radius = e.layer._mRadius
                let center = e.layer._latlng
                let temp = zoom_setter(radius*radius*3.1415)
                set_zoom(temp[0])
                set_position([center.lat, center.lng])
                break;
            case "rectangle":
                set_drawn(polygon(e))
                let center2 = [(e.layer._latlngs[0][3].lat + e.layer._latlngs[0][1].lat)/2, (e.layer._latlngs[0][3].lng + e.layer._latlngs[0][1].lng)/2]
                set_position(center2)
                set_zoom(9)
                break;
            case "marker":
                set_drawn(point(e))
                let center3 = e.layer._latlng
                set_position([center3.lat, center3.lng])
                set_zoom(9)
                break;
            default:
                break;
        }
        set_layer_type(e.layerType)
    }

    function zoom_setter(temp_area) {
        if (temp_area < 20000000) 
            return [10, 0.5]
        else if (temp_area < 200000000) 
            return [9, 1.5]
        else if (temp_area < 2000000000) 
            return [8, 3]
        else 
            return [7, 5.5]
    }

    function get_space() {
        let form = new FormData();
        form.append("id", space_name)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/by_id", {
            method: "POST",
            body: form
        })
        .then(res=>res.json())
        .then(res=>{

            let temp_zoom = zoom_setter(res[0][4])
                
            let temp_pos = res[0][3].replace('POINT(', '').replace(')', '').split(" ").reverse()
            set_position(temp_pos)
            set_zoom(temp_zoom[0])

            let parse = require('wellknown');
            set_space(res[0][0])
                
            set_space(res.map(doc => (
                <GeoJSON key={doc[0]} data={parse(doc[1])}>
                </GeoJSON>
            )))
        })
    }

    function get_type(type) {
        switch(type) {
            case "AERIAL PHOTOS":
                return "Fotografia aérea"
                break
            case "LiDAR":
                return "LiDAR"
                break
            case "ORTOS":
                return "Ortofotomapa"
                break
            case "SATELLITE IMAGES":
                return "Imagem satélite"
                break
            case "CHOROGRAPHIC MAPS":
                return "Carta corográfica"
                break
            case "TOPOGRAPHIC MAPS":
                return "Carta topográfica"
                break
            case "GEOGRAPHIC MAPS":
                return "Carta geográfica"
                break
            case "TOPOGRAPHIC PLANS":
                return "Plano topográfico"
                break
            case "THEMATIC MAPS":
                return "Carta temática"
                break
            case "DRAWINGS":
                return "Desenhos"
                break
            case "PHOTOS":
                return "Fotografia"
                break
            case "REPORTS":
                return "Relatório"
                break
            case "SENSORS":
                return "Dados de sensores"
                break
            case "CENSUS":
                return "Censos"
                break
            case "SURVEYS":
                return "Estatística de formulário"
                break
            case "THEMATIC STATISTICS":
                return "Estatística temática"
                break
            default:
                return "Documento"
                break
        }
    }

    function get_space_from_document(id) {
        set_doc_space(<></>)
        set_modal1(true)
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_space", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            if (result.length == 0) {
                return
            }
            set_doc_before(id)

            let temp_zoom = zoom_setter(result[0][3])
            
            let temp_pos = result[0][1].replace('POINT(', '').replace(')', '').split(" ").reverse()
            set_position(temp_pos)
            set_zoom(temp_zoom[0])
            let parse = require('wellknown');
            set_doc_space(
                <>
                    <GeoJSON key={1} data={parse(result[0][0])}>
                    </GeoJSON>
                </>
            )
            set_modal1(false)
        })
    }

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }

    async function get_document_by_space_geometry1() {
        let form = new FormData();
        let response = null

        switch(layer_type) {
            case "circle":
                form.append("lng", lng)
                form.append("lat", lat)
                form.append("size", size)

                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_circle", {
                    method: "POST",
                    
                    body: form
                })

                response = await response.json();

                form = new FormData()
                form.append("list", response)
                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/from_list", {
                    method: "POST",
                    body: form
                })
                response = await response.json();

                set_results(response)
                
                break;
            case "marker":
                form.append("space", drawn);
                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_marker", {
                    method: "POST",
                    
                    body: form
                })
                response = await response.json();

                let temp = []
                for (let i = 0; i<response.length; i++)
                    temp.push(response[i][0])

                form = new FormData()
                form.append("list", temp)
                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/from_list", {
                    method: "POST",
                    body: form
                })
                response = await response.json();

                set_results(response)
                break;
            default:
                form.append("space", drawn);
                
                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_geometry", {
                    method: "POST",
                    
                    body: form
                })
                response = await response.json();

                form = new FormData()
                form.append("list", response)
                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/from_list", {
                    method: "POST",
                    body: form
                })
                response = await response.json();

                set_results(response)
                break;
        }
    }

    async function get_document_by_space_geometry2(temp_list) {
        let form = new FormData();
        let response = null;
        form.append("list", temp_list)
        
        switch(layer_type) {
            case "circle":
                form.append("lng", lng)
                form.append("lat", lat)
                form.append("size", size)

                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_circle_list", {
                    method: "POST",
                    
                    body: form
                })

                response = await response.json();

                set_results(response)
                
                break;
            case "marker":
                form.append("space", drawn);
                
                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_marker_list", {
                    method: "POST",
                    
                    body: form
                })
                response = await response.json();
                set_results(response)
                break;
            default:
                form.append("space", drawn);
                
                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_geometry_list", {
                    method: "POST",
                    
                    body: form
                })
                response = await response.json();
                set_results(response)
                break;
        }
    }

    async function get_results() {
        set_modal1(true)
        set_doc_space(<></>)
        set_space(<></>)
        set_doc_before(-1)
        if (search_type.includes(1)) {
            let form = new FormData()
            form.append("query", search.toLowerCase().trim())
            let response = await fetch("http://urbingeo.fa.ulisboa.pt:5050/es/search", {
                method: "POST",
                body: form
            })

            let ar = await response.json();

            if (search_type.includes(3)) {
                get_document_by_space_geometry2(ar) 
            } else if (search_type.includes(2)) {
                get_space()
                
                let form = new FormData()
                form.append("space", space_name)
                form.append("list", ar)
    
                let response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_by_space_id_list", {
                    method: "POST",
                    body: form
                })
                response = await response.json();

                set_results(response)

            } else {
                form = new FormData()
                form.append("list", ar)
                response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/from_list", {
                    method: "POST",
                    body: form
                })
                ar = await response.json();

                set_results(ar)
                set_position([39.7, -9.3])
                set_zoom(7)
            }
        } else if (search_type.includes(3)) {
            get_document_by_space_geometry1()
        } else {
            get_space()
            
            let form = new FormData()
            form.append("space", space_name)

            let response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_by_space_id", {
                method: "POST",
                body: form
            })

            response = await response.json();

            form = new FormData()
            form.append("list", response)
            response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/from_list", {
                method: "POST",
                body: form
            })
            response = await response.json();

            set_results(response)
        } 
            
        set_modal1(false)
    }

    return(
        <>
            <Modal
                keepMounted
                open={modal1}
                >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <CircularProgress/>
                </div>
            </Modal>
            <div
                style={{
                    position: "fixed",
                    background: "rgba(256, 256, 256, 0.85)",
                    float: "left",
                    width: "55%",
                    height: "92%",
                }}>
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "10%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "8px"
                    }}>
                    <Autocomplete
                        freeSolo
                        options={temp_dictionary}
                        filterOptions={filterOptions}
                        inputValue={search}
                        style={{
                            width: "32%",
                            borderRadius: "5px",
                        }}
                        onInputChange={(e, values, reason) => {
                            if (reason === 'clear') {
                                let temp = [...search_type]
                                temp = temp.filter(function (letter) {
                                    return letter != 1;
                                });
                                set_search_type(temp)
                                set_search('')
                                set_temp_dictionary([])
                            } else {
                                set_search(values)
                                if (values.length >= 1) {
                                    let temp = [...search_type]
                                    temp.push(1)
                                    temp = removeDuplicates(temp)
                                    set_search_type(temp)
                                    set_temp_dictionary(dictionary)
                                } else {
                                    let temp = [...search_type]
                                    temp = temp.filter(function (letter) {
                                        return letter != 1;
                                    });
                                    set_search_type(temp)
                                    set_temp_dictionary([])
                                }
                            }
                          }}
                        renderInput={(params) => <TextField 
                            {...params} 
                            label="O quê?" 
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    get_results()
                                }
                            }}
                        />}/>  
                    <Autocomplete
                        disablePortal
                        disabled={default_space}
                        filterOptions={filterOptions}
                        inputValue={aux_space_name}
                        options={temp_all_spaces.map((option)=>({id: option[0], label: option[1]}))}
                        style={{
                            width: "32%",
                            borderRadius: "5px",
                            marginLeft: "10px"
                        }}
                        getOptionLabel={option => option.label}
                        onInputChange={(e, values, reason) => {
                            if (reason === 'clear') {
                                let temp = [...search_type]
                                temp = temp.filter(function (letter) {
                                    return letter != 2;
                                });
                                set_search_type(temp)
                                set_space_name('')
                                set_temp_all_spaces([])
                            } else if (reason === "input") {
                                set_aux_space_name(values)
                                let temp = [...search_type]
                                temp = temp.filter(function (letter) {
                                    return letter != 2;
                                });
                                set_search_type(temp)
                                if (values.length >= 1)
                                    set_temp_all_spaces(all_spaces)
                                else 
                                    set_temp_all_spaces([])
                            }
                        }}
                        renderInput={(params) => <TextField 
                            {...params} 
                            label="Onde?" 
                            />}
                        onChange={(e, value) => {
                            if (value) {
                                let temp = [...search_type]
                                temp.push(2)
                                set_search_type(temp)
                                set_aux_space_name(value.label)
                                set_space_name(value.id)
                            }
                        }}/>
                    <Button 
                        size="large"
                        variant="contained" 
                        disabled= {search_type.length==0}
                        onClick= {() => {
                            set_page(100)
                            get_results()
                        }}
                        style={{
                            zIndex: 400,  
                            marginLeft: "10px"  
                        }}>
                            Pesquisar 
                    </Button>
                    <Button 
                        size="large"
                        variant="contained" 
                        disabled= {results.length<1}
                        onClick= {() => {
                            set_page(100)
                            set_space_name("")
                            set_search("")
                            set_aux_space_name("")
                            set_results([])
                            set_doc_space(<></>)
                            set_space(<></>)
                            const drawnItems = editable_FG._layers;
                            if (Object.keys(drawnItems).length > 0) {
                                Object.keys(drawnItems).forEach((layerid, index) => {
                                    if (index > 0) return;
                                    const layer = drawnItems[layerid];
                                    editable_FG.removeLayer(layer);
                                });
                            }
                            set_default_space(false)
                            set_search_type([])
                            set_position([39.7, -9.3])
                            set_zoom(7)
                        }}
                        style={{
                            zIndex: 400,  
                            marginLeft: "10px"  
                        }}>
                            Limpar 
                    </Button>
                </div>
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "90%",
                        top: "10%",
                        justifyContent: "center"
                    }}>
                    <Typography 
                        variant="h6" 
                        style={{ 
                            fontWeight: "bold",
                            paddingTop: "10px",
                            color: "rgba(0, 0, 0, 0.7)",
                            margin:"auto",
                            height:"5%"
                        }}>
                        {results.length} Resultados
                    </Typography>
                    <div
                        onScroll={(e)=>{
                            if (e.target.scrollHeight - e.target.scrollTop < e.target.scrollTop*0.33 && results?.length > page)
                                set_page(page+100)
                        }}
                        style={{
                            marginTop: "20px",
                            position: "absolute",
                            height: "92%",
                            width: "100%",
                            overflow: "auto"
                        }}>
                        {results?.length>0 && results.map((doc, index) => {
                            let temp_type = get_type(doc[3])
                            if (index<=page)
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            height:"225px",
                                            marginTop: "10px"
                                        }}>
                                        <div
                                            style={{
                                                position: "absolute",
                                                width: "95%",
                                                height: "100%",
                                                marginTop: "10px",
                                                display: "flex",
                                                justifyContent: "left",
                                                marginLeft: "20px"
                                            }}>
                                            <Typography
                                                variant="h6"
                                                fontSize={22}
                                                color="black"
                                                sx={{fontWeight: 'bold'}}>
                                                {doc[5]}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                fontSize={30}
                                                style={{
                                                    position:"absolute",
                                                    marginLeft: "60%",
                                                    marginTop:"50px",
                                                    color: "rgba(0, 0, 0, 0.2)",
                                                    fontWeight: 'bold'
                                                }}>
                                                {temp_type}
                                            </Typography>
                                            <Typography
                                                variant="body"
                                                fontSize={18}
                                                color="black"
                                                style={{
                                                    position:"absolute",
                                                    marginTop:"30px",
                                                }}>
                                                {doc[1]}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontSize={14}
                                                color="black"
                                                style={{
                                                    position:"absolute",
                                                    marginTop:"55px",
                                                    fontWeight: 'bold'
                                                }}>
                                                Ano: 
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontSize={14}
                                                color="black"
                                                style={{
                                                    position:"absolute",
                                                    marginTop:"55px",
                                                    marginLeft: "35px"
                                                }}>
                                                {doc[6]} 
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontSize={14}
                                                color="black"
                                                style={{
                                                    position:"absolute",
                                                    marginTop:"75px",
                                                    fontWeight: 'bold'
                                                }}>
                                                Arquivista: 
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontSize={14}
                                                color="black"
                                                style={{
                                                    position:"absolute",
                                                    marginTop:"75px",
                                                    marginLeft: "80px"
                                                }}>
                                                {doc[4]} 
                                            </Typography>
                                            <div
                                                style={{
                                                    position:"absolute",
                                                    marginTop:"110px",
                                                    maxHeight: "60px",
                                                    width:"100%",
                                                    textAlign: "left",
                                                    overflow: "auto"
                                                }}>
                                                <Typography
                                                    variant="body2"
                                                    fontSize={12}
                                                    color="black">
                                                    {doc[2]} 
                                                </Typography>
                                            </div>
                                            <Button 
                                                size="small"
                                                variant="contained" 
                                                style={{
                                                    position: "absolute",
                                                    marginTop: "180px"
                                                }}
                                                onClick= {() => {
                                                    navigate(`/document/${doc[0]}`)
                                                }}>
                                                Visitar página
                                            </Button>
                                            {doc[7] ? (
                                                <Button 
                                                    size="small"
                                                    variant="contained" 
                                                    style={{
                                                    position: "absolute",
                                                    marginTop: "180px",
                                                    marginLeft: "150px"
                                                    }}
                                                    onClick={() => {
                                                    if (doc_before === doc[0]) {
                                                        set_doc_before(-1)
                                                        set_doc_space(<></>)
                                                    } else {
                                                        get_space_from_document(doc[0])
                                                    }
                                                    }}
                                                >
                                                    Ver contexto espacial
                                                </Button>
                                                ) : null}
                                            
                                        </div>
                                        <hr
                                            style={{
                                                width: "98%",
                                                left: "2%",
                                                position: "absolute",
                                                marginTop: "230px",
                                            }}/>
                                    </div>
                                )
                            else return(<></>)
                        })}
                    </div>
                </div>
            </div>
            <MapContainer 
                style={{
                    position: 'fixed',
                    marginLeft: "55%",
                    width: "45%",
                    boxShadow: 24,
                    height: "92%",
                }} 
                center={position} 
                zoom={zoom} 
                scrollWheelZoom={true} 
                minZoom={5}>
                <ChangeView center={position} zoom={zoom} /> 
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FeatureGroup ref={featureGroupRef => {
                    onFeatureGroupReady(featureGroupRef);
                }}>
                    <EditControl 
                        style={{
                            display: "none"
                        }}
                        position="topleft"
                        onCreated={(e) => {
                            _created(e)
                        }}
                        onDeleted={()=>{
                            set_drawn(null)
                            set_default_space(false)
                            set_position([39.7, -9.3])
                            set_zoom(7)
                        }}
                        draw= {{
                            circlemarker: false,
                            polyline: false,
                            polygon: false
                        }}
                        edit={{edit:false}}/>
                </FeatureGroup> 
                {space}
                {doc_space}  
            </MapContainer> 
        </>
    )
}