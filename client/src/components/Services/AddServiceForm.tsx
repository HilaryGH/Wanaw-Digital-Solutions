import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";

const subcategoriesByCategory: Record<string, { label: string; options: string[] }> = {
  Wellness: {
    label: "Wellness Subcategories",
    options: [
      "Spa and Wellness Treatments",
      "Cosmetic Services",
      "Holistic Therapies",
    ],
  },
 Medical: {
  label: "Medical Subcategories",
  options: [
    "Prenatal Services",
    "Dental Services",
    "Physiotherapy Services",
    "Diagnostic Imaging Services",
    "Kidney Dialysis Services",
    "Aesthetic Services - Dermatology",
    "Aesthetic Services - Aesthetic Treatments",
  ],
},

 
Hotel: {
  label: "Hotel Room Types",
  options: [
    // A. Star Rated
    "3 Star - Standard Room",
    "3 Star - Deluxe Room",
    "3 Star - Twin Room",
    "3 Star - Suite Room",
    "3 Star - Royal Suite Room",

    "4 Star - Standard Room",
    "4 Star - Deluxe Room",
    "4 Star - Twin Room",
    "4 Star - Suite Room",
    "4 Star - Royal Suite Room",

    "5 Star - Standard Room",
    "5 Star - Deluxe Room",
    "5 Star - Twin Room",
    "5 Star - Suite Room",
    "5 Star - Royal Suite Room",
    "5 Star - Presidential Room",

    // B. Pensions
    "Pension - Standard Room",
    "Pension - Deluxe Room",
    "Pension - Twin Room",
    "Pension - Suite Room",
  ],
},
HomeBasedServices: {
  label: "home based services",
  options: [
    // A. Health
    "Health - Medical - Primary Care",
    "Health - Medical - Preventive Services",

    "Health - Skilled Nursing - Full Time",
    "Health - Skilled Nursing - Assistants",
    "Health - Skilled Nursing - Care Taker",

    // B. Wellness
    "Wellness - Massage Therapy",
    "Wellness - Yoga Sessions",
    "Wellness - Nutrition Coaching",
    "Wellness - Mental Health Support",
    "Wellness - Physical Therapy",
  ],
},

//Add more categories with subcategories here as needed
};

const AddServiceForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const allowedRoles = ["provider", "admin"];

    if (!user || !allowedRoles.includes(user.role)) {
      alert("Only providers or admins can add services.");
      navigate("/membership");
    }
  }, [navigate, user]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategory("");
  }, [category]);

  const handleSubmit = async () => {
    if (!title || !category || !price || !image) {
      alert("Title, Category, Price, and Image are required.");
      return;
    }

    // Optional: enforce subcategory selection if category has subcategories
    if (subcategoriesByCategory[category] && !subcategory) {
      alert("Please select a subcategory.");
      return;
    }

    try {
      const imageForm = new FormData();
      imageForm.append("image", image);

      const uploadRes = await fetch(`${BASE_URL.replace("/api", "")}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageForm,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.imageUrl;

      const serviceRes = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          subcategory,
          price,
          duration,
          tags,
          location,
          imageUrl,
        }),
      });

      if (!serviceRes.ok) {
        throw new Error("Failed to create service");
      }

      alert("Service added successfully!");
      navigate("/services");
    } catch (err) {
      console.error(err);
      alert("Failed to add service");
    }
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white shadow w-full max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add a Service</h2>

      <input
        type="text"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 mb-4"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 mb-4"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 mb-4"
        required
      >
        <option value="">Select Category *</option>
        <option value="Wellness">Wellness</option>
        <option value="Medical">Medical</option>
        
        <option value="HomeBasedServices">Home Based Services</option>

        <option value="Hotel">Hotel</option>
      </select>

      {/* Show subcategory dropdown if category selected and has subcategories */}
      {category && subcategoriesByCategory[category] && (
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-2 mb-4"
          required
        >
          <option value="">Select {subcategoriesByCategory[category].label} *</option>
          {subcategoriesByCategory[category].options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      <input
        type="number"
        placeholder="Price *"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-xl p-2 mb-4"
        required
      />

      <input
        type="text"
        placeholder="Duration (e.g. 60 minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 mb-4"
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 mb-4"
      />

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full border border-gray-300 rounded-xl p-2 mb-4"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-[#1c2b21] text-white font-semibold py-2 rounded"
      >
        Add Service
      </button>
    </div>
  );
};

export default AddServiceForm;

