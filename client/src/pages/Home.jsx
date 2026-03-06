import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {

  const [products,setProducts] = useState([]);
  const [activeCategory,setActiveCategory] = useState("All");
  const navigate = useNavigate();

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

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-40">
        <h1 className="text-7xl md:text-8xl font-extrabold leading-tight max-w-5xl">
          Own Less.
          <br />
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Experience More.
          </span>
        </h1>

        <p className="mt-8 text-gray-400 max-w-2xl text-xl">
          Rent gadgets, furniture, tools, and daily essentials on flexible monthly plans.
        </p>
      </section>


      {/* Featured Rentals */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-10">
            Featured <span className="text-indigo-500">Rentals</span>
          </h2>


          {/* Category Filters */}
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            {["All","Tech","Furniture","Tools","Gaming","Kitchen"].map(cat=>(
              <button
                key={cat}
                onClick={()=>setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full transition ${
                  activeCategory===cat
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>


          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {filteredProducts.map(product=>(

              <div
                key={product._id}
                className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-300"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-60 w-full object-cover"
                />

                <div className="p-6">

                  <h3 className="text-2xl font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-indigo-400 mt-3 text-lg">
                    ₹{product.price}/mo
                  </p>

                  <p className="text-gray-400 text-sm">
                    ₹{product.deposit} deposit
                  </p>

                  <button
                    onClick={()=>navigate(`/product/${product._id}`)}
                    className="mt-6 w-full bg-indigo-600 py-3 rounded-xl hover:bg-indigo-500 transition"
                  >
                    Rent Now
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;