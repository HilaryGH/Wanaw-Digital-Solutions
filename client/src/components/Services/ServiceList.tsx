import  { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../../api/api";

const ServiceList = () => {
  const [services, setServices] = useState<any[]>([]); // you can replace any with your service type
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get category from query string
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/services`);
        const data = await res.json();

        // Filter if category param exists
        const filtered = categoryFilter
          ? data.filter((s: any) =>
              s.category.toLowerCase().includes(categoryFilter.toLowerCase())
            )
          : data;

        setServices(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryFilter]);

  const handleAddToCart = (service: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(service);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`"${service.title}" added to cart!`);
    navigate("/cart");
  };

  const handleSendGift = (service: any) => {
    navigate("/send-gift", { state: { service } });
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-16 text-lg">
        Loading services...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-10">
      <h1 className="text-3xl font-extrabold text-center text-[#1c2b21] mb-10">
        🎁 Available Services
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 p-5 flex flex-col"
          >
           {service.imageUrl && (
  <img
    src={service.imageUrl}
    alt={service.title}
    className="w-full h-48 object-cover rounded-xl mb-4"
  />
)}


            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1c2b21] mb-2">
                {service.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                Category: {service.category}
              </p>
              <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                {service.description}
              </p>
              <p className="text-lg font-semibold text-[#D4AF37] mb-2">
                ${service.price}
              </p>
              {service.location && (
  <p className="text-sm text-gray-600 mb-1">
    Location: {service.location}
  </p>
)}

              <p className="text-xs text-gray-400 mb-4">
                Posted by: {service?.providerId?.fullName || "Unknown"}
              </p>
            </div>

            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => handleAddToCart(service)}
                className="w-1/2 bg-[#1c2b21] text-white font-medium py-2 rounded-md hover:bg-[#111] transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleSendGift(service)}
                className="w-1/2 bg-[#D4AF37] text-[#1c2b21] font-medium py-2 rounded-md hover:bg-[#caa82f] transition"
              >
                Send Gift
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
