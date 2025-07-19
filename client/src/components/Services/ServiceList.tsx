import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../../api/api";

const wellnessSubcategories = [
  {
    label: "Spa and Wellness Treatments",
    options: ["Massages", "Facials", "Other Spa Services"],
  },
  {
    label: "Cosmetic Services",
    options: ["Skin Treatments", "Hair Styling", "Makeup Services"],
  },
  {
    label: "Holistic Therapies",
    options: ["Aromatherapy", "Acupuncture", "Reiki"],
  },
];

const homeBasedSubcategories = [
  {
    label: "Health - Medical",
    options: ["Primary Care", "Preventive Services"],
  },
  {
    label: "Health - Skilled Nursing",
    options: ["Full Time", "Assistants", "Care Taker"],
  },
  {
    label: "Wellness",
    options: [
      // Add wellness services later
    ],
  },
];


const aestheticianSubcategories = [
  {
    label: "Dermatology",
    options: [
      "Acne Treatment",
      "Scar Removal Treatment",
      "Hair Transplant",
      "Laser Hair Removal",
      "General Treatment",
    ],
  },
  {
    label: "Aesthetic Treatments",
    options: [
      "Facials",
      "Chemical peels",
      "Microneedling",
      "Waxing",
      "Makeup application",
      "Body treatments",
    ],
  },
];

const medicalSubcategories = [
  {
    label: "Prenatal Services",
    options: [
      "Checkups & ultrasound",
      "Checkup only",
      "Intravenous drip",
    ],
  },
  {
    label: "Dental Services",
    options: [
      "Crowning",
      "Braces",
      "Fillings",
      "Scaling",
      "Denture",
      "Extraction",
      "Root Canal Therapy",
      "Implants",
    ],
  },
  {
    label: "Physiotherapy Services",
    options: [
      "Consultant ~ Full Time",
      "Consultant ~ Visit~1",
      "Consultant ~ Visit~2",
      "Consultant ~ Visit~3",
    ],
  },
  {
    label: "Diagnostic Imaging Services",
    options: ["CT Scan", "MRI"],
  },
];


const hotelRoomSubcategories = [
  {
    label: "3 Star Hotel",
    options: [
      "Standard Room",
      "Deluxe Room",
      "Twin Room",
      "Suit Room",
      "Royal Suite Room",
    ],
  },
  {
    label: "4 Star Hotel",
    options: [
      "Standard Room",
      "Deluxe Room",
      "Twin Room",
      "Suit Room",
      "Royal Suite Room",
    ],
  },
  {
    label: "5 Star Hotel",
    options: [
      "Standard Room",
      "Deluxe Room",
      "Twin Room",
      "Suit Room",
      "Royal Suite Room",
      "Presidential Room",
    ],
  },
  {
    label: "Pensions",
    options: ["Standard Pension Room"],
  },
];


const ServiceList = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 new
  const [selectedSubcategory, setSelectedSubcategory] = useState("");



  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category");



useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await fetch(`${BASE_URL}/services`);
      const data = await res.json();

      const filtered = data.filter((s: any) => {
        const categoryMatch = categoryFilter
          ? s.category?.toLowerCase().includes(categoryFilter.toLowerCase())
          : true;

        const subCategoryMatch = selectedSubcategory
          ? s.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
          : true;

        return categoryMatch && subCategoryMatch;
      });

      setServices(filtered);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services", error);
      setLoading(false);
    }
  };

  fetchServices();
}, [categoryFilter, selectedSubcategory]);

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

 const filteredServices = services.filter((service) => {
  const query = searchTerm.toLowerCase();

  const matchesSearch =
    service.title.toLowerCase().includes(query) ||
    service.description.toLowerCase().includes(query) ||
    service.category.toLowerCase().includes(query);

  const matchesSubcategory = selectedSubcategory
    ? service.subcategory === selectedSubcategory
    : true; // if no subcategory selected, don't filter by it

  return matchesSearch && matchesSubcategory;
});


  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-16 text-lg">
        Loading services...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-10">
      <h1 className="text-3xl font-extrabold text-center text-[#1c2b21] mb-6">
        🎁 Available Services
      </h1>

     {/* 🔍 Search input */}
<div className="max-w-md mx-auto mb-10 space-y-4">
  <input
    type="text"
    placeholder="Search services..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
  />

  {/* 🏨 Hotel Room Subcategory Dropdown */}
  {categoryFilter?.toLowerCase() === "hotel" && (
    <select
      value={selectedSubcategory}
      onChange={(e) => setSelectedSubcategory(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
    >
      <option value="">-- Select Room Type --</option>
      {hotelRoomSubcategories.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )}

  {categoryFilter?.toLowerCase() === "wellness" && (
  <select
    value={selectedSubcategory}
    onChange={(e) => setSelectedSubcategory(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
  >
    <option value="">-- Select Wellness Subcategory --</option>
    {wellnessSubcategories.map((group) => (
      <optgroup key={group.label} label={group.label}>
        {group.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </optgroup>
    ))}
  </select>
)}

{/* 🧖 Aesthetician Services Dropdown */}
{categoryFilter?.toLowerCase() === "aesthetician" && (
  <select
    value={selectedSubcategory}
    onChange={(e) => setSelectedSubcategory(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
  >
    <option value="">-- Select Aesthetician Subcategory --</option>
    {aestheticianSubcategories.map((group) => (
      <optgroup key={group.label} label={group.label}>
        {group.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </optgroup>
    ))}
  </select>
)}
{categoryFilter?.toLowerCase() === "home based services" && (
  <select
    value={selectedSubcategory}
    onChange={(e) => setSelectedSubcategory(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
  >
    <option value="">-- Select Home Based Subcategory --</option>
    {homeBasedSubcategories.map((group) => (
      <optgroup key={group.label} label={group.label}>
        {group.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </optgroup>
    ))}
  </select>
)}


  {/* 🏥 Medical Subcategory Dropdown */}
  {categoryFilter?.toLowerCase() === "medical" && (
    <select
      value={selectedSubcategory}
      onChange={(e) => setSelectedSubcategory(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
    >
      <option value="">-- Select Medical Subcategory --</option>
      {medicalSubcategories.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )}
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
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
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No services match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
