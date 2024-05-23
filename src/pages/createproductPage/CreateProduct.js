import React, {useState,useEffect} from 'react'
import { createProduct,UpdateProduct,clearProductsState } from '../../features/productSlice'
import { useDispatch,useSelector } from 'react-redux'
import { categories } from '../../utils/constants'
import CustomBtn from '../../components/customBtn'
import { useToasts } from "react-toast-notifications"
import { useNavigate,useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import "./createProduct.css"


const initialState = {
    title: '',
    price: 0,
    description: '',
    category: '',
}

const CreateProducts = () => {

    const dispatch=useDispatch()
    const navigate = useNavigate()
    const {id} = useParams();
    const { addToast:notify } = useToasts()
    const [image,setImage] = useState(null)
    const [isEdit,setIsEdit] =useState(false)
    const [product, setProduct] = useState(initialState)


    const {userData} = useSelector((state)=>state.user)
    const {products,isCreating,isCreatedSuccessfully,isCreationError,creationErrMsg,creationSucMsg,
        isUpdating,isUpdatedSuccessfully,isUpdatingError,updatingErrMsg,updatingSucMsg
    }
    =useSelector((state)=>state.product)
    const depedancy = [isUpdatedSuccessfully,isCreatedSuccessfully,isUpdatingError,isCreationError]
   
    

    
    useEffect(() => {
        if(id){
            setIsEdit(true)
            products.forEach(product => {
                if(product.id === id) {
                    setProduct(product)
                    setImage(product.image)
                }
            })
        }
    }, [])


    useEffect(()=>{
        if(isCreatedSuccessfully || isUpdatedSuccessfully){
            notify(`${creationSucMsg || updatingSucMsg}`,{
                appearance: 'success',
                autoDismiss:"true"
            })
            dispatch(clearProductsState())
            navigate("/")
        }
        if(isCreationError || isUpdatingError){
            notify(`${creationErrMsg || updatingErrMsg}`,{
                appearance: 'error',
                autoDismiss:"true"
            })
        }
    },[...depedancy])

    const handleChangeInput = (e) =>{
        const {name, value} = e.target
        setProduct({...product, [name]:value})
    }

    const handleSubmit = async (e) =>{

        e.preventDefault();

        if(isEdit){
            if(!product.title || !product.description || !product.category || image===null){
                notify(`Please Fill All Fields First!`,{
                    appearance: 'warning',
                    autoDismiss:"true"
                })
            }else{
                if(typeof(image)==="object"){
                    if(image.size > 1024 * 1024){
                        notify(`Image Size too large!`,{
                            appearance: 'warning',
                            autoDismiss:"true"
                        })
                    }else{
                        await dispatch(UpdateProduct({
                            productId:product.id,
                            userId:userData.id,
                            product:{...product,price:Number(product.price)},
                            productImg:image
                        }))
                    }
                }else{
                    await dispatch(UpdateProduct({
                        productId:product.id,
                        userId:userData.id,
                        product:{...product,price:Number(product.price)}
                    }))
                }
            }
        }else{
            if(!product.title || !product.description || !product.category || image===null){
                notify(`Please Fill All Fields First!`,{
                    appearance: 'warning',
                    autoDismiss:"true"
                })
            }else{
                if(image.size > 1024 * 1024){
                    notify(`Image Size too large!`,{
                        appearance: 'warning',
                        autoDismiss:"true"
                    })
                }else{
                    await dispatch(createProduct({
                        userId:userData.id,
                        product:{...product,price:Number(product.price)},
                        productImg:image,
                    }))
                }
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
                            <img alt='product-img' src={typeof(image)==="string"?image:URL.createObjectURL(image)} />
                            <span onClick={()=>setImage(null)}>X</span>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <label htmlFor='file_up'>
                            <FontAwesomeIcon icon={faUpload} />
                        </label>
                        <input type="file" name="file" style={{display:"none"}}  id="file_up" onChange={(e)=>setImage(e.target.files[0])}/>
                    </React.Fragment>

                }  
            </div>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" id="title" required
                    value={product.title} onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="price">Price:</label>
                    <input type="number" name="price" id="price" required
                    value={product.price} onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea type="text" name="description" id="description" required
                    value={product.description} rows="5" onChange={handleChangeInput} />
                </div>


                <div>
                    <label htmlFor="categories">Categories:</label>
                    <select name="category" value={product.category} onChange={handleChangeInput} >
                        <option value="">Please select a category</option>
                        {
                            categories.map((category,ind) => (
                                <option value={category} key={ind}>
                                    {category}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {
                    isEdit?
                    <CustomBtn 
                        content={"Update"} type="submit"
                        isLoading={isUpdating}
                        bgColor={"#1f2f98"} fontSize={"18px"} 
                    />
                    :
                    <CustomBtn 
                        content={"Create"} type="submit"
                        isLoading={isCreating}
                        bgColor={"#1f2f98"} fontSize={"18px"} 
                    />
                }
            </form>
        </div>
    )
}

export default CreateProducts
