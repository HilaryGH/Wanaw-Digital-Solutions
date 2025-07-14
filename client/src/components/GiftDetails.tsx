import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

/* ─── Types ─────────────────────────────────────────── */
type Occasion = {
  _id: string;
  title: string;
  category: string;
  occasion?: string;
  description?: string;
  imageUrl?: string;
};

type Service = {
  _id: string;
  title: string;
  price?: number;
  description?: string;
  imageUrl?: string;
};

/* ─── Component ─────────────────────────────────────── */
const GiftDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  /* --- Helpers --- */
  const slugify = (text: string) =>
    text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  /* --- Fetch occasion + its services --- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* 1. Get all occasions (or a single one if you have an endpoint) */
        const ocRes = await fetch(`${BASE_URL}/gift`);
        const occasions: Occasion[] = await ocRes.json();
        const matched = occasions.find(o => slugify(o.title) === slug);

        if (!matched) return setOccasion(null);

        setOccasion(matched);

        /* 2. Now fetch services linked to this occasion */
      const srvRes = await fetch(`${BASE_URL}/services?occasionId=${matched._id}`);

        
        const srvData: Service[] = await srvRes.json();
        setServices(srvData);
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };

    fetchData();
  }, [slug]);

  /* --- Send Gift handler --- */
  const handleSendGift = () => {
    const selectedService = services.find(s => s._id === selectedServiceId);
    if (!selectedService || !occasion) return;

    navigate("/send-gift", {
      state: {
        occasion,          // the occasion info
        service: selectedService // the concrete service
      }
    });
  };

  /* --- UI states --- */
  if (occasion === null) return <div className="p-6">Gift occasion not found.</div>;
  if (!occasion) return <div className="p-6">Loading...</div>;

  /* --- Main render --- */
  return (
    <div className="min-h-screen bg-[#f9f9f9] py-10 px-6 md:px-20">
      {/* Occasion banner */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-12">
        {occasion.imageUrl && (
          <img
            src={`${BASE_URL.replace("/api", "")}${occasion.imageUrl}`}
            alt={occasion.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-3xl font-bold text-[#1c2b21] mb-2">
          {occasion.title}
        </h1>
        <p className="text-sm text-gray-500 mb-1">
          Category:&nbsp;{occasion.category}
        </p>
        {occasion.description && (
          <p className="text-base mt-4 text-gray-700">
            {occasion.description}
          </p>
        )}
      </div>

      {/* Service selection */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#1c2b21] mb-6">
          Choose the service you’d like to send
        </h2>

        {services.length === 0 ? (
          <p className="text-gray-600">No services available for this occasion yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map(service => (
              <label
                key={service._id}
                className={`cursor-pointer bg-white border rounded-xl p-4 transition 
                  duration-300 shadow hover:shadow-lg flex flex-col
                  ${
                    selectedServiceId === service._id
                      ? "ring-2 ring-offset-2 ring-[#D4AF37]"
                      : ""
                  }`}
              >
                {service.imageUrl && (
                  <img
                    src={`${BASE_URL.replace("/api", "")}${service.imageUrl}`}
                    alt={service.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}

                <span className="text-lg font-semibold">{service.title}</span>
                {service.price && (
                  <span className="text-sm text-gray-500">
                    {service.price} ETB
                  </span>
                )}
                {service.description && (
                  <span className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {service.description}
                  </span>
                )}

                {/* Hidden radio for accessibility */}
                <input
                  type="radio"
                  name="service"
                  className="sr-only"
                  value={service._id}
                  checked={selectedServiceId === service._id}
                  onChange={() => setSelectedServiceId(service._id)}
                />
              </label>
            ))}
          </div>
        )}

        <button
          onClick={handleSendGift}
          disabled={!selectedServiceId}
          className={`mt-10 w-full bg-[#D4AF37] text-[#1c2b21] font-medium py-2 rounded-md
            transition ${!selectedServiceId ? "opacity-50 cursor-not-allowed" : "hover:bg-[#caa82f]"}`}
        >
          {selectedServiceId ? "Proceed to Checkout" : "Select a Service"}
        </button>
      </div>
    </div>
  );
};

export default GiftDetails;

