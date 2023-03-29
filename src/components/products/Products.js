import React,{useEffect,useState} from "react";
import { useDispatch,useSelector } from 'react-redux'
import { useToasts } from "react-toast-notifications"
import { GetConfig, IsAdmin, IsUser } from "../utils/UserData";
import {  checkAllPro, checkOnePro, ourProducts,deleteCheckedProducts,deleteProduct,clearState} from "../../features/shop/productSlice";
import { addToCart,userInfo,clearState as clearCardState } from "../../features/shop/userSlice";
import { ourCategory } from "../../features/shop/categorySlice";
import ProductItem from "../productitem/ProductItem";
import Loading from "../loading/Landing";
import "./products.css"

const Products = () =>{
    const {config,user,isAdmin} = {
        config:GetConfig(),
        user:IsUser(),
        isAdmin:IsAdmin()
    }
    const dispatch = useDispatch()
    const { addToast:notify } = useToasts()
    const {products,result,isError,isSuccess,successMsg,errorMsg} = useSelector((state)=>state.product)
    const {cart,isError:isErr,isSuccess:isSuc,errorMsg:errMsg,successMsg:sucMsg} = useSelector((state)=>state.user)
    const categories = useSelector((state)=>state.category.categories)
    const[category,setCategory]=useState('')
    const[sort,setSort]=useState('')
    const[search,setSearch]=useState('')
    const[page,setPage]=useState(1)

    const[isCheck,setIsCheck]=useState(false)

    useEffect(()=>{
       dispatch((ourCategory()))
       dispatch(ourProducts({page,category,sort,search}))
    },[category,sort,search,page])


    useEffect(()=>{
        dispatch(clearState())
        dispatch(clearCardState());
    },[])

    useEffect(()=>{
       const fun = async () =>{
           await dispatch(ourProducts({page,category,sort,search}))
           await dispatch(userInfo(config))
           await dispatch(clearState())
           await dispatch(clearCardState());
       }
       if(isSuccess || isSuc){
        fun();
        notify(`${successMsg || sucMsg}`,{
            appearance: 'success',
            autoDismiss:"true"
        })
        
       }else if(isError || isErr){
        notify(`${errorMsg || errMsg}`,{
            appearance: 'error',
            autoDismiss:"true"
        })
         dispatch(clearState());
         dispatch(clearCardState());
       }
    },[isError,isSuccess,isErr,isSuc])

    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }
    const checkAll = () =>{
        dispatch(checkAllPro(!isCheck))
        setIsCheck(!isCheck)
    }
    const chekProduct = (id) =>{
        dispatch(checkOnePro(id))
    }
    const deleteProductItem = async(id,publicid) =>{
        //eslint-disable-next-line no-restricted-globals
        if(confirm("do you really want to delete this product")===true){
        dispatch(deleteProduct({id,publicid,config}))
        }
    }
    const deleteAll = async () =>{
        //eslint-disable-next-line no-restricted-globals
        if(confirm("Do You Really Want To Delete Theese Products")===true){
            await dispatch(deleteCheckedProducts({products,config}))
            setIsCheck(false)
        }
    }
    const check = (id) =>{
        let check=false;
        cart.forEach((x)=>{
          if(x._id===id){
            check=true
          }
        })
        return check
    }
    const addTocart = async (product) =>{
        const cartData={cart: [...cart, {...product, quantity: 1}]}
           if(check(product._id)){
            notify(`This Product Already In The Cart`,{
                appearance: 'warning',
                autoDismiss:"true"
            })
           }else if(user){
                await dispatch(addToCart({cartData,config}))
           }else{
            notify(`You Have To Login First`,{
                appearance: 'warning',
                autoDismiss:"true"
            })
           }
    }
    return(
        <div className="products-section">
           <div className="filtering">
               <div className="category-filter">
                    <span>Filters:</span>
                    <select name="category" value={category} onChange={handleCategory}>
                        <option value="">All Products</option>
                        {
                            categories.map(category => (
                                <option value={"category=" + category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
               </div>
               <div className="search-filter">
                    <span>search:</span>
                    <input type="text" value={search} placeholder="Enter your search!"
                    onChange={e => setSearch(e.target.value.toLowerCase())} />
               </div>
               <div className="sort-filter">
                    <span>Sort By:</span>
                    <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value=''>Newest</option>
                        <option value='sort=oldest'>Oldest</option>
                        <option value='sort=-sold'>Best sales</option>
                        <option value='sort=-price'>Price: Hight-Low</option>
                        <option value='sort=price'>Price: Low-Hight</option>
                    </select>
               </div>
           </div>
           {isAdmin&&
               <div className="deleting">
                   <span>select all:</span>
                   <input type="checkbox" checked={isCheck} onChange={checkAll} />
                   <button onClick={deleteAll}>Delete All</button>
               </div>
            }
           {result<=0?<Loading />:(
               <div className="products">
               {products.map(product=>{
                   return <ProductItem key={product._id} isAdmin={isAdmin} addToCart={addToCart} chekProduct={chekProduct}
                       product={product} addTocart={addTocart} deleteProduct={deleteProductItem}
                        />
               })}
           </div>
           )}
            {result<page*9?
                null:
                <div className="loadbtn">
                    <button onClick={()=>setPage(page+1)}>Load More</button>
                </div>
            }
        </div>
    )
}
export default Products
