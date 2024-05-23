import axios from "axios"

const UploadImg = async (image) =>{
    const fd = new FormData()
    fd.append('file',image)
    fd.append("upload_preset","ecommerce")
    fd.append("api_key", "372336693865194")
    const response = await axios.post("https://api.cloudinary.com/v1_1/dibuevfps/image/upload",fd)
    const url = await response.data.url
    return url
}
export default UploadImg