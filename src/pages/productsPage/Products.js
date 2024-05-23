import React,{useEffect,useState} from "react";
import { useDispatch,useSelector } from 'react-redux'
import { useToasts } from "react-toast-notifications"
import { categories } from "../../utils/constants";
import { getAllUsers, updateUserCart } from "../../features/userSlice";
import { getAllProducts,checkAllProducts,checkSingleProduct,deleteProduct,clearProductsState,deleteCheckedProducts } from "../../features/productSlice";
import ProductCard from "../../components/productcard/Productcard";
import CustomBtn from "../../components/customBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";
import "./products.css"



const Products = () =>{

    const dispatch = useDispatch()
    const { addToast:notify } = useToasts()
    const showFilterIcon = useMediaQuery({maxWidth:900})
    const [showFilter,setShowFilter] = useState(true)
    const {products,isDeletedSuccessfully,deletingSucMsg,isDeletingError,deletingErrMsg,
    isDeleting,isDeletingAll,isDeletedAllSuccessfully,isDeletingAllError,deletingAllErrMsg,
    deletingAllSucMsg} = useSelector((state)=>state.product)

    const {userData,updateUserCartError,updateUserCartErrMsg} = useSelector((state)=>state.user)
    const depedancy = [isDeletedSuccessfully,isDeletingError,isDeletedAllSuccessfully,isDeletingAllError,updateUserCartError]
    const[category,setCategory]=useState('')
    const[search,setSearch]=useState('')
    const[isCheck,setIsCheck]=useState(false)

    let filteredProductsByCategory = category===""?[...products]:products.filter((product)=>product.category===category)
    let productsAfterFilter = filteredProductsByCategory.filter((product)=>product.title.includes(search))


    useEffect(()=>{
        dispatch(getAllProducts())
        dispatch(getAllUsers())
    },[category])


    useEffect(()=>{
       if(!showFilterIcon){
        setShowFilter(true)
       }else{
        setShowFilter(false)
       }
    },[showFilterIcon])

    useEffect(()=>{

       if(isDeletedSuccessfully || isDeletedAllSuccessfully){
        notify(`${deletingSucMsg || deletingAllSucMsg}`,{
            appearance: 'success',
            autoDismiss:"true"
        })
        dispatch(clearProductsState())
       }
       if(isDeletingError || isDeletingAllError || updateUserCartError){
        notify(`${deletingErrMsg || deletingAllErrMsg || updateUserCartErrMsg}`,{
            appearance: 'error',
            autoDismiss:"true"
        })
        dispatch(clearProductsState())
       }

    },[...depedancy])

    
    const checkAll = () =>{
        dispatch(checkAllProducts({productsAfterFilter,checked:!isCheck}))
        setIsCheck(!isCheck)
    }


    const checkProduct = (id) =>{
        dispatch(checkSingleProduct(id))
    }


    const deleteProductItem = (id) =>{
        dispatch(deleteProduct({
            productId:id,
            userId:userData.id,
        }))
    }


    const deleteAll = async () =>{
        let checkedProductsIDS = productsAfterFilter.filter((product)=>Boolean(product.checked)).map((ele)=>ele.id)
        if(checkedProductsIDS.length){
            await dispatch(deleteCheckedProducts({userId:userData.id,checkedProductsIDS}))
            setIsCheck(false)
        }else{
            notify(`You Did not Mark Any Products To Be Deleted`,{
                appearance: 'warning',
                autoDismiss:"true"
            })
        }
    }

    const addTocart = async (product) =>{
        if(userData.token){
            const cart = [...userData.cart, {...product, quantity: 1}]
            let updatedUser={
                ...userData,
                cart
            }
            await dispatch(updateUserCart({updatedUser,userId:userData.id}))
        }else{
        notify(`You Have To Login First`,{
            appearance: 'warning',
            autoDismiss:"true"
        })
        }
    }


    return(
        <div className="shop-page">
           <div className={`filtering`} style={{display:showFilter?"flex":"none"}}>
                {userData.role==="admin"&&
                    <div className="deleting">
                        <h3>select all products:</h3>
                        <div>
                            <input type="checkbox" checked={isCheck} onChange={checkAll} />
                            <CustomBtn 
                                content={"Delete All Checked"} 
                                isLoading={isDeletingAll}
                                bgColor={"#1f2f98"} fontSize={"16px"} 
                                clickFun={deleteAll}
                            />
                        </div>
                    </div>
                }
               <div className="category-filter">
                    <h3>Filters By Category:</h3>
                    <div className="all-categories">
                        <div onClick={()=>setCategory("")}>
                            <input 
                                type="checkbox" name="category" value="" 
                                checked={category===""}
                            />
                            <span>All Products</span>
                            
                        </div>
                        {
                            categories.map((item,ind)=>{
                                return(
                                    <div onClick={()=>setCategory(item)} key={ind}>
                                        <input 
                                           type="checkbox" name="category" value={`${item}`}
                                           checked={item===category}
                                        />
                                        <span>{item}</span>
                                        
                                    </div>
                                )
                            })
                        }
                    </div>
               </div>
           </div>
           <div className="products-section" style={{paddingTop:showFilterIcon?showFilter?"0px":"45px":"45px"}}>
                <div className="search-filter">
                    <input type="text" value={search} placeholder="Search"
                    onChange={e => setSearch(e.target.value.toLowerCase())} />
                    {
                        showFilterIcon&&
                        <FontAwesomeIcon onClick={()=>setShowFilter(!showFilter)} icon={faSlidersH} />
                    }
                </div>
                {!productsAfterFilter.length?
                <div className="not-found">No Products Matching With Your Filters..</div>
                :(
                <div className="all-products">
                    {productsAfterFilter.map(product=>{
                    return <ProductCard 
                                key={product.id} 
                                product={product} 
                                addTocart={addTocart} 
                                isDeleting={isDeleting} 
                                checkProduct={checkProduct}
                                deleteProduct={deleteProductItem}
                            />
                    })}
                </div>
                )}
           </div>
        </div>
    )
}
export default Products
