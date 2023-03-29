import React, {useState,useEffect} from 'react'
import { createProduct,UpdateProduct,ourProducts,clearState } from '../../features/shop/productSlice'
import { ourCategory } from '../../features/shop/categorySlice'
import { useDispatch,useSelector } from 'react-redux'
import Ring from "react-cssfx-loading/lib/Ring"
import { useToasts } from "react-toast-notifications"
import { useParams,useHistory } from 'react-router'
import { GetConfig, IsAdmin,GetToken } from '../utils/UserData'
import "./createProduct.css"

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: 'How to and tutorial videos of cool CSS effect, Web Design ideas,JavaScript libraries, Node.',
    content: 'Welcome to our channel Dev AT. Here you can learn web designing, UI/UX designing, html css tutorials, css animations and css effects, javascript and jquery tutorials and related so on.',
    category: '',
    _id: ''
}

const CreateProducts = () => {

    const dispatch=useDispatch()
    const history = useHistory()
    const {id} = useParams();
    const { addToast:notify } = useToasts()
    const [image,setImage] = useState(null)
    const [isEdit,setIsEdit] =useState(false)
    const [product, setProduct] = useState(initialState)
   
    const {config,isAdmin}={config:GetConfig(),isAdmin:IsAdmin()}
    const imgConfig={
        headers: {'content-type': 'multipart/form-data', Authorization: GetToken()}
    }

    const categories = useSelector((state)=>state.category.categories)
    const {products,isError,isLoading,isSuccess,successMsg,errorMsg}=useSelector((state)=>state.product)
   
    

    
    useEffect(() => {
        dispatch(ourCategory())
        if(id){
            setIsEdit(true)
            products.forEach(product => {
                if(product._id === id) {
                    setProduct(product)
                    setImage(product.images)
                }
            })
        }
    }, [id,products])

    useEffect(()=>{
      dispatch(clearState())
    },[])

    useEffect(()=>{
        const fun = async()=>{
            await dispatch(ourProducts())
            await dispatch(clearState())
            history.push("/")
        }
        if(isSuccess){
            notify(`${successMsg}`,{
                appearance: 'success',
                autoDismiss:"true"
            })
            fun();
        }else if(isError){
            notify(`${errorMsg}`,{
                appearance: 'error',
                autoDismiss:"true"
            })
            dispatch(clearState())
        }
    },[isError,isSuccess])

    const handleChangeInput = (e) =>{
        const {name, value} = e.target
        setProduct({...product, [name]:value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!isAdmin){
            notify(`You're not an admin`,{
                appearance: 'info',
                autoDismiss:"true"
            })
        }
        if(image===null){
            notify(`No Image Upload.`,{
                appearance: 'warning',
                autoDismiss:"true"
            })
        }else{
            if(image.size > 1024 * 1024){
                notify(`Size too large!`,{
                    appearance: 'warning',
                    autoDismiss:"true"
                })
            } // 1mb
        }
        
        let formData = new FormData()
        formData.append('file', image)
        if(isEdit){
            await dispatch(UpdateProduct({id,product,image,formData,config,imgConfig}))
        }else{
            if(product.title.length===0 ||product.category.length===0 ||product.product_id.length===0 ||image===null){
                notify(`Please Fill All Requirements First!`,{
                    appearance: 'warning',
                    autoDismiss:"true"
                })
            }else{
                await dispatch(createProduct({product, formData,config,imgConfig}))
            }
        }
            
    }

    return (
        <div className="create_product">
            <div className="upload">
                {
                    image?
                    <React.Fragment>
                        <div id="file_img">
                            {
                                isEdit?
                                <img src={image.url?image.url:URL.createObjectURL(image)} alt='' />
                                :
                                <img alt='' src={image&&URL.createObjectURL(image)} />
                            }
                            <span onClick={()=>setImage(null)}>X</span>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <label htmlFor='file_up'>+</label>
                        <input type="file" name="file" style={{display:"none"}}  id="file_up" onChange={(e)=>setImage(e.target.files[0])}/>
                    </React.Fragment>

                }  
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="product_id">Product ID</label>
                    <input type="text" name="product_id" id="product_id" required
                    value={product.product_id} onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={product.title} onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" required
                    value={product.price} onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                    value={product.description} rows="5" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content" required
                    value={product.content} rows="7" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="categories">Categories: </label>
                    <select name="category" value={product.category} onChange={handleChangeInput} >
                        <option value="">Please select a category</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <button type="submit">
                    {
                        isEdit?
                        <React.Fragment>
                            <span>Update</span>
                            {
                                isLoading&&
                                <Ring color="#FFF" width="25px" height="25px" duration="1s" />
                            } 
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <span>Create</span>
                            {
                                isLoading&&
                                <Ring color="#FFF" width="25px" height="25px" duration="1s" />
                            }
                        </React.Fragment>
                    }
                </button>
            </form>
        </div>
    )
}

export default CreateProducts
