import FadingBalls from "react-cssfx-loading/lib/FadingBalls"
const Load = () =>{
    return(
        <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            width:"100%",
            height:`${window.innerHeight - 1}px`,
        }}>
            <FadingBalls color="#FF0000" width="15px" height="15px" duration="3s" />
        </div>
    )
}
export default Load