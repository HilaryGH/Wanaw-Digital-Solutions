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
  Wellness: { letter: "", label: "Wellness Services" },
  Medical: { letter: "", label: "Medical Services" },
  "Home Based/Mobile Services": {
    letter: "",
    label: "Home Based / Mobile Services",
  },
  "Hotel Rooms": { letter: "", label: "Hotel Room Services" },
};

/* Category images from public folder */
const categoryImages: Record<string, string> = {
  Wellness: "/wellness.svg",
  Medical: "/medical.svg",
  "Home Based/Mobile Services": "/home-services.svg",
  "Hotel Rooms": "/hotel-room.svg"
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
    <section className="px-4 py-10 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-[#1c2b21] mb-16">
        Service Catalog
      </h2>

      {Object.entries(categoryHeadings).map(([catKey, meta]) => {
        const grouped = services.filter((s) => s.category === catKey);
        const categoryImage = categoryImages[catKey] || "/placeholder.svg";

        return (
          <div key={catKey} className="mb-20">
            {/* CATEGORY IMAGE BANNER */}
         <div className="mb-6 rounded-2xl overflow-hidden shadow-xl group flex flex-col md:flex-row items-center md:items-stretch gap-6">
  {/* IMAGE on the left, 2/3 width */}
  <img
    src={categoryImage}
    alt={`${catKey} cover`}
    className="w-full md:w-1/2 h-[260px] object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
  />

  {/* TEXT and BUTTON on the right, 1/3 width */}
  <div className="flex flex-col justify-center text-center md:text-left px-4 md:px-0 flex-1 md:w-1/3">
    <h3 className="text-3xl md:text-4xl font-bold text-[#1c2b21] drop-shadow-lg">
      {meta.letter} {meta.label}
    </h3>
    <button
      onClick={() =>
        setExpandedCategory(expandedCategory === catKey ? null : catKey)
      }
      className="mt-6 bg-[#D4AF37] text-[#1c2b21] font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#caa82f] transition inline-block max-w-max"
    >
      {expandedCategory === catKey ? "Hide Services" : "View Services"}
    </button>
  </div>
</div>

            {/* SERVICE CARDS */}
            {expandedCategory === catKey && grouped.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {grouped.map((srv) => (
                  <div
                    key={srv._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
                  >
                    <img
                      src={imgSrc(srv.imageUrl)}
                      alt={srv.title}
                      className="w-full h-[260px] object-cover"
                    />
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-lg font-semibold text-[#1c2b21]">
                        {srv.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        👤 {srv.providerId?.fullName ?? "Unknown Provider"}
                      </p>
                      {srv.location && (
                        <p className="text-sm text-gray-500 mt-1">
                          📍 {srv.location}
                        </p>
                      )}
                      <p className="text-base font-medium text-gray-800 mt-2">
                        {formatPrice(srv.price)}
                      </p>

                      <button
                        onClick={() =>
                          navigate("/send-gift", { state: { service: srv } })
                        }
                        className="mt-auto bg-[#D4AF37] text-[#1c2b21] text-sm font-semibold py-2 rounded-full hover:bg-[#caa82f] transition mt-4"
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
