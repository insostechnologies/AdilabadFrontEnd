import { createContext, useEffect, useState } from "react";
export const AdminSidebarContext = createContext()  

export const AdminSidebarContextProvider = ({children}) => {

    const [isSidebar, toggleSidebar] = useState(JSON.parse(localStorage.getItem('isSidebar')) || false)

    const toggle = () => {
        toggleSidebar(!isSidebar)
    }

    useEffect(()=>{
        localStorage.setItem('isSidebar', isSidebar)
        // console.log(JSON.parse(localStorage.getItem('isSidebar')) || true)
    },[isSidebar])

    return (

        <AdminSidebarContext.Provider value={{isSidebar, toggle}}>
            {children}
        </AdminSidebarContext.Provider>

    )

}