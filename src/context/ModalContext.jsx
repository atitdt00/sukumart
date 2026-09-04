"use client"
import { createContext, useContext, useState } from "react";


const ModalContext= createContext();


export function ModalProvider({children}){
    const [showLogin, setShowLogin]= useState(false);
    const [showSignup, setShowSignup]=useState(false);


    //open signup modal
    const openLogin=()=>{
        setShowSignup(false)
        setShowLogin(true);
    };

    //open Singup Modal
    const openSignup=()=>{
        setShowLogin(false);
        setShowSignup(true);
    };
    //close login
    const closeLogin=()=>{
        setShowLogin(false)
    }

    //Close signup
    const closeSignup=()=>{
        setShowSignup(false);
    };

    return(
        <ModalContext.Provider value={{showLogin, showSignup, setShowLogin, setShowSignup, openLogin, openSignup,  closeLogin, closeSignup}}>
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