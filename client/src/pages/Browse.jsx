import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Browse(){

  const [products,setProducts] = useState([]);

  useEffect(()=>{

    axios
      .get("http://localhost:8000/api/products")
      .then(res=>{
        setProducts(res.data);
      })
      .catch(err=>{
        console.log(err);
      });

  },[]);

  return(

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-10">
        Browse Rentals
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {products.map(product=>(
          
          <Link key={product._id} to={`/product/${product._id}`}>

            <div className="bg-slate-900 rounded-xl p-4 hover:scale-105 transition">

              <img
                src={product.image}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />

              <h2 className="text-xl font-bold">
                {product.name}
              </h2>

              <p className="text-indigo-400">
                ₹{product.price}/mo
              </p>

              <p className="text-gray-400">
                Deposit ₹{product.deposit}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </div>

  );
}

export default Browse;