"use client"
import { createContext, useContext, useState } from "react";


const ModalContext= createContext();


export function ModalProvider({children}){
    const [showLogin, setShowLogin]= useState(false);
    const [showSignup, setShowSignup]=useState(false);
    const [showAdmin, setShowAdmin]= useState(false);


    //open signup modal
    const openLogin=()=>{
        setShowLogin(true);
        setShowSignup(false);
        setShowAdmin(false);
    };

    //open Singup Modal
    const openSignup=()=>{
        setShowSignup(true);
        setShowLogin(false);
        setShowAdmin(false)
    };

    //open Admin modal
    const openAdmin=()=>{
        setShowAdmin(true);
        setShowLogin(false);
        setShowSignup(false)

    }


    //close login
    const closeLogin=()=>{
        setShowLogin(false)
    }

    //Close signup
    const closeSignup=()=>{
        setShowSignup(false);
    };

    //close Admin modal
    const closeAdmin=()=>{
        setShowAdmin(false);
    }



    return(
        <ModalContext.Provider value={{ showAdmin, openAdmin, closeAdmin, showLogin, showSignup, setShowLogin, setShowSignup, openLogin, openSignup,  closeLogin, closeSignup}}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal(){
    const context= useContext(ModalContext);
    if(!context){
        throw new Error('useModal must be used inside ModalProvider')
    }
    return context;
}