import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({children}) =>{
    const {userData} = useSelector((state)=>state.user)
    return userData.token && userData.role==="admin"? children : <Navigate to={"/login"} />
}
export default ProtectedAdmin;