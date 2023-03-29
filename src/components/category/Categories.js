import React,{useEffect, useState} from "react";
import { useSelector,useDispatch } from "react-redux";
import { GetConfig } from "../utils/UserData";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications"
import { createCategory, ourCategory,deleteCategory, updateCategory,clearState } from "../../features/shop/categorySlice";
import "./category.css"
const Categories = () =>{
    const config = GetConfig();
    const {categories,isError,isSuccess,errorMsg,successMsg} = useSelector((state)=>state.category)
    const products = useSelector((state)=>state.product.products)
    const history = useHistory()
    const dispatch = useDispatch();
    const { addToast:notify } = useToasts()
    const[category,setCategory]=useState('')
    const[Edit,setEdit]=useState(false)
    const[categoryId,setCategoryId]=useState(null)
    

    useEffect(()=>{
        dispatch(ourCategory())
    },[])

    useEffect(()=>{
        dispatch(clearState())
    },[])

    useEffect(()=>{
       const fun = async () =>{
        await dispatch(ourCategory())
        dispatch(clearState())
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

    
    const onEdit = (name,id) =>{
        setCategory(name)
        setEdit(!Edit)
        setCategoryId(id)
    }
    
    const check = (id) =>{
        let check = false
        products.forEach(ele => {
            if(ele.category===id){
                check=true
            }
        });
        return check;
    }

    const CreateCategory = async(e) =>{
        e.preventDefault();
        let name={name:category} 
        await dispatch(createCategory({name,config:config}))
        setCategory('')
    }

    const UpdateCategory = async(e) =>{
        e.preventDefault();
        let name={name:category}
        await dispatch(updateCategory({id:categoryId,name,config:config}))
        setCategory('')
        setEdit(!Edit)   
    }
    
    const DeleteCategory = async(id) =>{
        if(check(id)){
            notify(`please delete all posts that have the same category first`,{
                appearance: 'warning',
                autoDismiss:"true"
            })
        }else{
            //eslint-disable-next-line no-restricted-globals
            if(confirm("do you realy want to delete this category")===true){
                dispatch(deleteCategory({id,config}))
            }  
        }
    }
    
    return(
        <div className="categories-section">
            {Edit?(
            <form onSubmit={UpdateCategory}>
                <label>categories</label>
                <div>
                    <input type="text" value={category} onChange={(e)=>setCategory(e.target.value)} />
                    <button type="submit">update</button>
                </div>
            </form>
            ):(
            <form onSubmit={CreateCategory}>
                <label>categories</label>
                <div>
                    <input type="text" value={category} onChange={(e)=>setCategory(e.target.value)} />
                    <button type="submit">create</button>
                </div>
            </form>
            )}
            <div className="allCategories">
                {categories.map((ele)=>{
                    return(
                        <div key={ele._id}>
                           <span>{ele.name}</span>
                           <div>
                                <button onClick={()=>onEdit(ele.name,ele._id)}>Edit</button>
                                <button onClick={()=>DeleteCategory(ele._id)}>Delete</button>
                           </div>
                        </div>
                    )
                })}
                <button onClick={()=>history.goBack()}>
                    GO Back
                </button>
            </div>
        </div>
    )
}
export default Categories