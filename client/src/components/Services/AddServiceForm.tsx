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

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "provider") {
      alert("Only providers can add services.");
      navigate("/membership");
    }
  }, [navigate, user]);

  const handleSubmit = async () => {
    if (!title || !category || !price || !image) {
      alert("Title, Category, Price and Image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price.toString());
    formData.append("duration", duration);
    formData.append("tags", tags); // e.g. "birthday,gift"
    formData.append("image", image); // the uploaded image file

    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // DO NOT set Content-Type manually with FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Something went wrong");
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

      <input
        type="text"
        placeholder="Category *"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-2 border mb-4"
        required
      />

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
