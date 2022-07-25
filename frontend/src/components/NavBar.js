import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import urbinlab from "../images/urbinlab.png"
import { useNavigate } from "react-router-dom";
import "./NavBar.css"

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 500,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function handleClick(navigate) {
  navigate(`/`)
}

export default function SearchAppBar() {
  let navigate = useNavigate();

  const search =e=> { 
    if(e.keyCode === 13){
      navigate(`/search/${e.target.value}/result`)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" style={{ background: '#f1f1f1' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => handleClick(navigate)}
          >
            <img src={urbinlab} className="urbinlab" alt="Logo" />
          </IconButton>
          <Typography
            component="div"
            sx={{ flexGrow: 0.2}}
          >
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

