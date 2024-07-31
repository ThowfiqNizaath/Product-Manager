// import logo from './logo.svg';
import"./App.css"
import { useState, useRef , useEffect} from 'react';
import { FaPlus } from "react-icons/fa";

const App = () => {
   
  const API_URL = "http://localhost:3500/products";
  const [product, setProduct] = useState([]);
  const [editid, setEditid] = useState(-1);

 useEffect(() => {
     const fetchAPI = async() => {
          try{
              const response = await fetch(API_URL);
              if(!response.ok) throw Error("Couldn't fetch API")
              const promise = response.json();
              // console.log(promise)
              promise.then((res) => setProduct(res))
          }
          catch(err){
              console.log(err);
          }
     }
      fetchAPI()
 } , [])

 
 
 function handleEdit(id){
     setEditid(id);
 }

 function handleSubmit(event){
   event.preventDefault();
   const name = event.target.elements.brand.value
   const price = event.target.elements.price.value;
   const newList = product.map(list => (
     list.id === editid ? {...list , name : name , price : price} : list
   ))
   const filterEditedProduct = newList.filter(product => product.id === editid);
   const reqUrl = `${API_URL}/${editid}`
   const patchObject = {
     method : 'PATCH',
     headers : {
      'Content-Type' : 'application/json'
     },
     body : JSON.stringify({name : filterEditedProduct[0].name , price : filterEditedProduct[0].price})
    }
   RequestApi(reqUrl, patchObject)
   console.log(patchObject)
   setProduct(newList)
   setEditid(-1)
 }

 const handleDelete = (id) => {
    const newItem = product.filter(item => item.id !== id)
    const deleteOption = {
      method : 'DELETE'
    }
    const requrl = `${API_URL}/${id}`
     RequestApi(requrl,deleteOption)
    setProduct(newItem)
 }

   return (
     <div className="container">
       <div className="table">
        <Inputbox url = {API_URL} product={product} setProduct={setProduct} />
         <form className="update" onSubmit={(e) => handleSubmit(e)}>
           <table>
             <tbody>
               {product.map((item) =>
                 editid === item.id ? (
                   <Edit item={item} />
                 ) : (
                   <tr>
                     <td>{item.name}</td>
                     <td>{item.price}</td>
                     <td>
                       <button key = {1}
                         className="edit"
                         onClick={() => handleEdit(item.id)}
                       >
                         Edit
                       </button>
                     </td>
                     <td>
                       <button className="delete" type = "button" onClick={() => handleDelete(item.id)}>
                         Delete
                       </button>
                     </td>
                   </tr>
                 )
               )}
             </tbody>
           </table>
         </form>
       </div>
     </div>
   );
}

const Edit = ({item , url}) => {
   
  const [editInputName , setEditInputName] = useState(item.name)
  const [editInputPrice, setEditInputPrice] = useState(item.price);

  function handleEditInputName(name){
     setEditInputName(name)
  }
  function handleEditInputPrice(price){
    setEditInputPrice(price)
  }

  return (
    <tr className= "edit">
      <td>
        <input type="text" name="brand" value = {editInputName} onChange = {(e) => 
          handleEditInputName(e.target.value)
        } required/>
      </td>
      <td>
        <input type="number" name="price" value={editInputPrice} onChange={(e) => handleEditInputPrice(e.target.value)} required />
      </td>
      <td colSpan={2}>
        <button type="submit">update</button>
      </td>
    </tr>
  );
}


const Inputbox = ({url, product , setProduct}) => {
  const nameRef = useRef()
  const priceRef = useRef()
  function handleSubmit(event) {
    event.preventDefault();
    var name = event.target.elements.name.value
    var price = event.target.elements.price.value
    var id = product.length ? product.length+1 : 1;
    const productDetails = {
      id : id ,
      name : name,
      price : price
    }
    const postObject = {
      method : 'POST',
      headers : {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(productDetails)
    }
    RequestApi(url , postObject)
    setProduct(ps => [...ps,productDetails])
    nameRef.current.value = ""
    priceRef.current.value = "";  
  }
  return (
    <form className="form-input" onSubmit={(e) => {
      handleSubmit(e);
    }}>
      <input type="text" placeholder="Brand" name="name" ref = {nameRef} required/>
      <input type="number" placeholder="Price" name="price" ref={priceRef} required/>
      <button type="submit"> <FaPlus /> </button>
    </form>
  );
}

const RequestApi = async(url , optionObject) => {
   try{
    console.log(url)
      const request = await fetch(url , optionObject)
      if(!request.ok) throw Error("couldn't ")
  }
  catch(err){
     console.log(err);
  }
}

export default App;