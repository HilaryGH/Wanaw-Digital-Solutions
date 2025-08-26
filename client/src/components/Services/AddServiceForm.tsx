import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";

const wellnessSubcategories = [
  { label: "Salon & Hairstyling", options: ["Hair Styling", "Haircut", "Hair Coloring", "Blow Dry"] },
  { label: "Gym & Fitness", options: ["Gym", "Personal Trainer", "Yoga Instructor", "Health Coach"] },
  { label: "Outdoor Wellness Activities", options: ["Hiking", "Wellness Camping"] },
  { label: "Spa and Wellness Treatments", options: ["Massages", "Facials", "Other Spa Services"] },
  { label: "Cosmetic Services", options: ["Skin Treatments", "Makeup Services"] },
  { label: "Holistic Therapies", options: ["Aromatherapy", "Acupuncture", "Reiki"] },
];

const medicalSubcategories = [
  { label: "Full Checkups", options: ["General Health Checkup", "Blood Tests", "Blood Pressure Monitoring", "Cholesterol & Glucose Screening", "Vision & Hearing Tests", "Physical Examination"] },
  { label: "Prenatal Services", options: ["Checkups & ultrasound", "Checkup only", "Intravenous drip"] },
  { label: "Dental Services", options: ["Crowning", "Braces", "Fillings", "Scaling", "Denture", "Extraction", "Root Canal Therapy", "Implants"] },
  { label: "Physiotherapy Services", options: ["Consultant ~ Full Time", "Consultant ~ Visit~1", "Consultant ~ Visit~2", "Consultant ~ Visit~3"] },
  { label: "Diagnostic Imaging Services", options: ["CT Scan", "MRI"] },
  { label: "Hemodialysis Services", options: ["Consultation", "Single Dialysis Session", "Weekly ~ Three Dialysis Session", "Bi-weekly ~ Six Dialysis Session", "Monthly ~ Twelve Dialysis Session"] },
  { label: "Aesthetic Services - Dermatology", options: ["Acne Treatment", "Scar Removal Treatment", "Hair Transplant", "Laser Hair Removal", "General Treatment"] },
  { label: "Nutritionist Services", options: ["Personalized Nutrition Plans", "Nutritional Counseling", "Nutritional Education", "Cooking Classes", "Weight Management", "Chronic Disease Management", "Ongoing Support", "Group Sessions"] },
  { label: "Aesthetic Services - Aesthetic Treatments", options: ["Facials", "Chemical peels", "Microneedling", "Waxing", "Makeup application", "Body treatments"] },
];

const homeBasedSubcategories = [
  { label: "Health - Medical", options: ["Primary Care", "Preventive Services"] },
  { label: "Health - Skilled Nursing", options: ["Full Time", "Assistants", "Care Taker"] },
  { label: "Spa and Wellness Treatments", options: ["Massages", "Facials", "Other Spa Services"] },
  { label: "Cosmetic Services", options: ["Skin Treatments", "Hair Styling", "Makeup Services"] },
];

const hotelRoomSubcategories = [
  { label: "3 Star Hotel", options: ["Standard Room", "Deluxe Room", "Twin Room", "Suit Room", "Royal Suite Room"] },
  { label: "4 Star Hotel", options: ["Standard Room", "Deluxe Room", "Twin Room", "Suit Room", "Royal Suite Room"] },
  { label: "5 Star Hotel", options: ["Standard Room", "Deluxe Room", "Twin Room", "Suit Room", "Royal Suite Room", "Presidential Room"] },
  { label: "Pensions", options: ["Standard Pension Room"] },
];

const subcategoriesMap: Record<string, typeof wellnessSubcategories> = {
  Wellness: wellnessSubcategories,
  Medical: medicalSubcategories,
"Home Based/Mobile Services": homeBasedSubcategories, // ✅ match schema
  Hotel: hotelRoomSubcategories, // ✅ match schema

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

  useEffect(() => {
    setSubcategory(""); // reset subcategory when category changes
  }, [category]);

  const handleSubmit = async () => {
    if (!title || !category || !price || !image) {
      alert("Title, Category, Price, and Image are required.");
      return;
    }
    if (subcategoriesMap[category] && !subcategory) {
      alert("Please select a subcategory.");
      return;
    }

    try {
      const imageForm = new FormData();
      imageForm.append("image", image);

      const uploadRes = await fetch(`${BASE_URL.replace("/api", "")}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: imageForm,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");

      const { imageUrl } = await uploadRes.json();

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
    providerId: user._id, // ✅ add this
  }),
});


      if (!serviceRes.ok) throw new Error("Failed to create service");

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

      <input type="text" placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-xl p-2 mb-4" required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-xl p-2 mb-4" />

  <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full border rounded-xl p-2 mb-4"
  required
>
  <option value="">Select Category *</option>
  <option value="Wellness">Wellness</option>
  <option value="Medical">Medical</option>
  <option value="Home Based/Mobile Services">Home Based/Mobile Services</option>
  <option value="Hotel">Hotel</option>
</select>


      {category && subcategoriesMap[category] && (
        <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full border rounded-xl p-2 mb-4" required>
          <option value="">Select Subcategory *</option>
          {subcategoriesMap[category].map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </optgroup>
          ))}
        </select>
      )}

      <input type="number" placeholder="Price *" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full border rounded-xl p-2 mb-4" required />
      <input type="text" placeholder="Duration (e.g. 60 minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border rounded-xl p-2 mb-4" />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded-xl p-2 mb-4" />
      <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border rounded-xl p-2 mb-4" />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full border rounded-xl p-2 mb-4" />

      <button onClick={handleSubmit} className="w-full bg-[#1c2b21] text-white font-semibold py-2 rounded">Add Service</button>
    </div>
  );
};

export default AddServiceForm;

