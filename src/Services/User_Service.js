import axios from "axios"
const API = process.env.NEXT_PUBLIC_API_URL || "";


export const getUsers= async()=>{
    try{
        const response= await axios.get(`${API}/api/users`);

        return response.data;

    }catch(error){
        console.error("User service Api error:", error)
    }
}