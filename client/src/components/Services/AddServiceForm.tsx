import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";

const AddServiceForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

useEffect(() => {
  const allowedRoles = ["provider", "admin"];

  // If there's no logged‑in user OR the role isn't allowed → redirect
  if (!user || !allowedRoles.includes(user.role)) {
    alert("Only providers or admins can add services.");
    navigate("/membership");
  }
}, [navigate, user]);


  const handleSubmit = async () => {
  if (!title || !category || !price || !image) {
    alert("Title, Category, Price and Image are required.");
    return;
  }

  try {
    // 🔁 Step 1: Upload image to Cloudinary
    const imageForm = new FormData();
    imageForm.append("image", image);

    const uploadRes = await fetch(`${BASE_URL.replace("/api", "")}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: imageForm,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(uploadData.msg || "Image upload failed");
    }

    const imageUrl = uploadData.imageUrl;

    // 🔁 Step 2: Submit service with imageUrl
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
        price,
        duration,
        tags,
        location,
        imageUrl, // ✅ attach Cloudinary image URL
      }),
    });

    const serviceData = await serviceRes.json();

    if (!serviceRes.ok) {
      throw new Error(serviceData.msg || "Failed to create service");
    }

    alert("Service added successfully!");
    navigate("/services");
  } catch (err) {
    console.error(err);
    alert("Failed to add service");
  }
};


  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white rounded shadow w-full max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add a Service</h2>

      <input
        type="text"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
      />

     <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
  required
>
  <option value="">Select Category *</option>
  <option value="Wellness">Wellness</option>
  <option value="Medical">Medical</option>
  <option value="Aesthetician">Aesthetician</option>
  <option value="Personal">Personal</option>
  <option value="Lifestyle">Lifestyle</option>
  <option value="Hotel">Hotel</option>
</select>


      <input
        type="number"
        placeholder="Price *"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
        required
      />

      <input
        type="text"
        placeholder="Duration (e.g. 60 minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
      />
      <input
  type="text"
  placeholder="Location"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
/>

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
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
