import React from 'react'
import * as AiIcons from "react-icons/ai"
import * as FaIcons from "react-icons/fa"
import * as Io5Icons from "react-icons/io5"
import * as Io4Icons from "react-icons/io"
import * as CgIcons from "react-icons/cg"

export const SidebarData = [
    {
        title: "Início",
        path: "/",
        icon: <AiIcons.AiFillHome/>,
        cName: "sidebar-text"
    },
    {
        title: "Documentos",
        path: "/documentos",
        icon: <Io5Icons.IoDocuments/>,
        cName: "sidebar-text"
    },
    {
        title: "Workspaces",
        path: "/workspaces",
        icon: <AiIcons.AiFillFolderOpen/>,
        cName: "sidebar-text"
    },
    {
        title: "Perfil",
        path: "/perfil",
        icon: <CgIcons.CgProfile/>,
        cName: "sidebar-text"
    },
    
]
