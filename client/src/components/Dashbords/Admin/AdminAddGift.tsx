import { useState,} from "react";
import type { ChangeEvent, FormEvent } from "react";
import BASE_URL from "../../../api/api";

const AdminAddGift = () => {
  const [gift, setGift] = useState({
    title: "",
    category: "corporate",
    occasion: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setGift({ ...gift, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(gift).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`${BASE_URL}/gift`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Gift added successfully!");
        setSuccess(true);
        setGift({ title: "", category: "corporate", occasion: "", description: "" });
        setImageFile(null);
        setPreviewUrl(null);
      } else {
        setMessage(`❌ ${data.msg}`);
        setSuccess(false);
      }
    } catch (err) {
      setMessage("❌ Server error");
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-12 border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-[#1c2b21] mb-6">
         Add a New Gift
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            name="title"
            value={gift.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c2b21]"
            placeholder="e.g. Welcome Kit"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={gift.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="corporate">Corporate</option>
            <option value="individual">Individual</option>
          </select>
        </div>

        {/* Occasion */}
        <div>
          <label className="block font-semibold mb-1">Occasion (optional)</label>
          <input
            name="occasion"
            value={gift.occasion}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="e.g. Ashenda, Birthday"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description (optional)</label>
          <textarea
            name="description"
            value={gift.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Write a short description..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-1">Gift Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-1 border border-gray-300 rounded-md bg-white"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 w-full max-h-64 object-contain rounded-lg border"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#1c2b21] hover:bg-[#2e4235] text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-200"
        >
          Add Gift
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AdminAddGift;


