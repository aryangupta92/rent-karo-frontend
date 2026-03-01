import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Menu, X, PlusCircle, User, ShoppingBag, 
  CheckCircle, Clock, MapPin, Loader, AlertCircle 
} from 'lucide-react';

// --- Constants ---
const API_URL = 'http://localhost:5000/api/listings';
const CATEGORIES = ["All", "Electronics", "Furniture", "Tools", "Appliances", "Camping", "Other"];

// --- Mock Data (Fallback) ---
const MOCK_LISTINGS = [
  {
    _id: '1',
    title: "Sony WH-1000XM5 Headphones",
    price: 45,
    category: "Electronics",
    description: "Industry-leading noise canceling headphones. Perfect for travel or focus work.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000",
    owner: "Jane Doe",
    location: "Downtown"
  },
  {
    _id: '2',
    title: "Herman Miller Aeron Chair",
    price: 120,
    category: "Furniture",
    description: "Ergonomic office chair, size B. Mesh back, fully adjustable.",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000",
    owner: "Office Supplies Co.",
    location: "Tech District"
  },
  {
    _id: '3',
    title: "Cordless Drill Set",
    price: 25,
    category: "Tools",
    description: "18V Cordless drill with battery packs and drill bits. Good for home repairs.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000",
    owner: "Bob's Tools",
    location: "Westside"
  }
];

// --- Components ---

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce-in z-50">
      {type === 'error' ? <AlertCircle size={20} className="text-red-400" /> : <CheckCircle size={20} className="text-green-400" />}
      <span>{message}</span>
    </div>
  );
};

const Navbar = ({ user, onLogin, onLogout, setView, view, toggleMenu, isMenuOpen }) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-blue-600 p-2 rounded-lg mr-2">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">RentEase</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => setView('browse')} className={`${view === 'browse' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 font-medium`}>Browse</button>
          
          {user ? (
            <>
              <button onClick={() => setView('create')} className="flex items-center text-gray-600 hover:text-blue-600 font-medium">
                <PlusCircle size={18} className="mr-1" /> List Item
              </button>
              <button onClick={() => setView('profile')} className="flex items-center text-gray-600 hover:text-blue-600 font-medium">
                <User size={18} className="mr-1" /> {user.name}
              </button>
              <button onClick={onLogout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
            </>
          ) : (
            <button onClick={onLogin} className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">
              Log In
            </button>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="text-gray-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </div>
    
    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="md:hidden bg-white border-t border-gray-100 py-2">
        <button onClick={() => { setView('browse'); toggleMenu(); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50">Browse</button>
        {user ? (
          <>
            <button onClick={() => { setView('create'); toggleMenu(); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50">List an Item</button>
            <button onClick={() => { setView('profile'); toggleMenu(); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50">My Profile</button>
            <button onClick={() => { onLogout(); toggleMenu(); }} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50">Logout</button>
          </>
        ) : (
          <button onClick={() => { onLogin(); toggleMenu(); }} className="block w-full text-left px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50">Log In</button>
        )}
      </div>
    )}
  </nav>
);

const ListingCard = ({ item, onRent }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
    <div className="h-48 overflow-hidden relative group">
      <img 
        src={item.image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000"} 
        alt={item.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700 uppercase tracking-wide">
        {item.category}
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
      </div>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
      
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-blue-600">${item.price}</span>
          <span className="text-gray-400 text-sm">/mo</span>
        </div>
        <button 
          onClick={() => onRent(item)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Rent Now
        </button>
      </div>
      <div className="flex items-center mt-3 text-xs text-gray-400">
        <MapPin size={12} className="mr-1" /> {item.location} • By {item.owner}
      </div>
    </div>
  </div>
);

const BrowsePage = ({ listings, onRent, loading, error, isMock }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Find What You Need</h2>
        
        {isMock && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 flex items-center text-sm">
            <AlertCircle size={16} className="mr-2" />
            Backend disconnected. Showing demo data.
          </div>
        )}
        
        {/* Search & Filter */}
        <div className="relative max-w-lg mb-6">
          <input
            type="text"
            placeholder="Search for items..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        </div>
        
        <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" size={40} /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">Error loading listings. Is the server running?</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map(item => (
              <ListingCard key={item._id} item={item} onRent={onRent} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              <p className="text-lg">No items found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CreateListingPage = ({ onSubmit, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    title: '', price: '', category: 'Electronics', description: '', location: '', image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">List Item for Rent</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
            <input 
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., DSLR Camera Kit"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Month ($)</label>
              <input 
                required
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Downtown, NY"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Describe condition and features..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <input 
              type="url"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {submitting ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Hero = ({ onBrowse }) => (
  <div className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden">
    <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
        Own Less. <span className="text-blue-400">Experience More.</span>
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
        The trusted platform to rent daily necessities, tools, and tech on a monthly basis.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={onBrowse} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-blue-900/50">
          Start Renting
        </button>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(null); 
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState(null); // { msg, type }
  const [submitting, setSubmitting] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // FETCH LISTINGS FROM BACKEND (with Fallback)
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { timeout: 3000 }); // 3s timeout
      setListings(res.data);
      setError(null);
      setUsingMockData(false);
    } catch (err) {
      console.warn("Backend unavailable, switching to mock data:", err.message);
      // FALLBACK
      setListings(MOCK_LISTINGS);
      setUsingMockData(true);
      // Don't set hard error, just warn
      if (err.code === "ERR_NETWORK") {
        showToast("Backend disconnected. Using offline mode.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleLogin = () => {
    setUser({ name: "Alex Renter", email: "alex@example.com", id: "u1" });
    showToast("Welcome back, Alex!");
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
    showToast("Logged out successfully.");
  };

  const handleCreateListing = async (formData) => {
    if (!user) return;
    
    setSubmitting(true);
    const newListing = {
      ...formData,
      price: Number(formData.price),
      owner: user.name,
      _id: Date.now().toString(), // Temp ID
      image: formData.image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000"
    };

    if (usingMockData) {
      // Offline mode
      setTimeout(() => {
        setListings([newListing, ...listings]);
        showToast("Listing created (Offline Mode)!");
        setSubmitting(false);
        setView('browse');
      }, 800);
      return;
    }

    try {
      // Online mode
      await axios.post(API_URL, newListing);
      showToast("Listing created successfully!");
      fetchListings(); // Refresh list
      setView('browse');
    } catch (err) {
      console.error("Error creating listing:", err);
      // Fallback if network fails mid-operation
      setListings([newListing, ...listings]);
      showToast("Backend failed. Saved locally.", "error");
      setUsingMockData(true);
      setView('browse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRent = (item) => {
    if (!user) {
      showToast("Please log in to rent items.", "error");
      return;
    }
    showToast(`Request sent for ${item.title}!`);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000); 
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      <Navbar 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        setView={setView} 
        view={view}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      <main>
        {view === 'home' && (
          <>
            <Hero onBrowse={() => setView('browse')} />
            {/* Featured Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="text-2xl font-bold mb-6">Recent Listings</h2>
              {loading ? (
                 <div className="text-gray-400">Loading listings...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {listings.slice(0, 4).map(item => (
                    <ListingCard key={item._id} item={item} onRent={handleRent} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {view === 'browse' && (
          <BrowsePage 
            listings={listings} 
            onRent={handleRent} 
            loading={loading}
            error={error}
            isMock={usingMockData}
          />
        )}

        {view === 'create' && (
          <CreateListingPage 
            onSubmit={handleCreateListing} 
            onCancel={() => setView('browse')} 
            submitting={submitting}
          />
        )}

        {view === 'profile' && (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold">Profile Page</h2>
            <p className="text-gray-500 mt-2">Rentals management coming soon...</p>
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}