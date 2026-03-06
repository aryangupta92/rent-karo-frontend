import { useState } from "react";
import axios from "axios";

function ListItem(){

  const [form,setForm] = useState({
    name:"",
    price:"",
    deposit:"",
    image:"",
    category:""
  });

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{

      await axios.post(
        "http://localhost:8000/api/products",
        form
      );

      alert("Item listed successfully");

    }catch(error){

      alert("Error listing item");

    }

  };

  return(

    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-xl w-[400px]"
      >

        <h2 className="text-2xl mb-6 font-bold">
          List Your Item
        </h2>

        <input
          name="name"
          placeholder="Item Name"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-slate-800 rounded"
        />

        <input
          name="price"
          placeholder="Monthly Rent"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-slate-800 rounded"
        />

        <input
          name="deposit"
          placeholder="Security Deposit"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-slate-800 rounded"
        />

        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-slate-800 rounded"
        />

        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-slate-800 rounded"
        />

        <button className="w-full bg-indigo-600 py-3 rounded hover:bg-indigo-500">
          List Item
        </button>

      </form>

    </div>
  )
}

export default ListItem;