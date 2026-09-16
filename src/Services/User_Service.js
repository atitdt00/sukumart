import axios from "axios"



export const getUsers= async()=>{
    try{
        const response= await axios.get(`/api/users`);

        return response.data;

    }catch(error){
        console.error("User service Api error:", error)
    }
}