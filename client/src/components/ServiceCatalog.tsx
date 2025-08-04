import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

/* Types */
type Service = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  location?: string;
  duration?: string;
  imageUrl?: string;
  providerId: { fullName: string };
};

/* Category headings */
const categoryHeadings: Record<string, { letter: string; label: string }> = {
  Wellness: { letter: "A.", label: "Wellness Services" },
  Medical: { letter: "C.", label: "Medical Services" },
  "Home Based/Mobile Services": {
    letter: "D.",
    label: "Home Based / Mobile Services",
  },
  "Hotel Rooms": { letter: "E.", label: "Hotel Room Services" },
};

/* Category images from public folder */
const categoryImages: Record<string, string> = {
  Wellness: "/wellness.svg",
  Medical: "/medical.svg",
  "Home Based/Mobile Services": "/home-services.svg",
  "Hotel Rooms": "/hotel-booking.svg",
};

const ServiceCatalog = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/services`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data: Service[] = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load services right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatPrice = (p: number) => `${p.toLocaleString()}\u202fETB`;
  const imgSrc = (url?: string) => url || "/placeholder.svg";

  if (loading)
    return (
      <section className="py-20 text-center text-gray-600">Loading …</section>
    );
  if (error)
    return (
      <section className="py-20 text-center text-red-600">{error}</section>
    );

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#1c2b21] mb-12">
        Service Catalog
      </h2>

      {Object.entries(categoryHeadings).map(([catKey, meta]) => {
        const grouped = services.filter((s) => s.category === catKey);
        const categoryImage = categoryImages[catKey] || "/placeholder.svg";

        return (
          <div key={catKey} className="mb-16">
            {/* CATEGORY IMAGE BANNER */}
            <div className="relative mb-3 rounded-xl overflow-hidden shadow-lg">
              <img
                src={categoryImage}
                alt={`${catKey} cover`}
                className="w-full h-48 object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl md:text-3xl font-bold">
                  {meta.letter} {meta.label}
                </h3>
                <button
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === catKey ? null : catKey
                    )
                  }
                  className="mt-4 bg-[#D4AF37] text-[#1c2b21] font-semibold text-sm px-4 py-2 rounded hover:bg-[#caa82f] transition"
                >
                  {expandedCategory === catKey ? "Hide Services" : "View Services"}
                </button>
              </div>
            </div>

            {/* SERVICE CARDS */}
            {expandedCategory === catKey && grouped.length > 0 && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {grouped.map((srv) => (
                  <div
                    key={srv._id}
                    className="bg-white rounded-xl shadow hover:shadow-md transition flex flex-col overflow-hidden"
                  >
                    <img
                      src={imgSrc(srv.imageUrl)}
                      alt={srv.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-md font-semibold text-[#1c2b21]">
                        {srv.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        👤 {srv.providerId?.fullName ?? "Unknown Provider"}
                      </p>
                      {srv.location && (
                        <p className="text-sm text-gray-500 mt-1">
                          📍 {srv.location}
                        </p>
                      )}
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {formatPrice(srv.price)}
                      </p>

                      <button
                        onClick={() =>
                          navigate("/send-gift", { state: { service: srv } })
                        }
                        className="mt-auto bg-[#D4AF37] text-[#1c2b21] text-sm font-semibold py-2 rounded hover:bg-[#caa82f] transition"
                      >
                        Send This Gift
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ServiceCatalog;


