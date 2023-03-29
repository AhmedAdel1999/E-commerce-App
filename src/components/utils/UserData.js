import { useSelector } from "react-redux"

const GetToken = () =>{
    const token = useSelector((state)=>state.user.token)
    return token
}
const GetConfig = () =>{
    const token = useSelector((state)=>state.user.token)
     return {
        headers:{
            Authorization:token
        }
    }
}
const IsUser = () =>{
    const role = useSelector((state)=>state.user.role)
    return role===0?true:false
}
const IsAdmin = () =>{
    const role = useSelector((state)=>state.user.role)
    return role===1?true:false}
const IsLogged = () =>{
    const token = useSelector((state)=>state.user.token)
    return token?true:false
}
export {GetConfig,GetToken,IsAdmin,IsUser,IsLogged};