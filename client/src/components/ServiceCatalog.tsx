import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

/* ─── Types coming from your back‑end ───────────────── */
type Service = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  location?:string;
  duration?: string;
  imageUrl?: string;
  providerId: { fullName: string };
};

/* ─── Category headings (same keys as DB) ───────────── */
const categoryHeadings: Record<
  string,
  { letter: string; label: string }
> = {
  Wellness: { letter: "A.", label: "Wellness Services" },
  Aesthetician: { letter: "B.", label: "Aesthetician" },
  Medical: { letter: "C.", label: "Medical" },
  Personal: { letter: "D.", label: "Personal / Self‑Care" },
  Lifestyle: { letter: "E.", label: "Lifestyle" },
  Hotel: { letter: "F.", label: "Hotel Room" },
};

const ServiceCatalog = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Fetch from back‑end on mount */
  useEffect(() => {
    const fetchServices = async () => {
      try {
       const res = await fetch(`${BASE_URL}/services`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data: Service[] = await res.json();
        console.log("Fetched services →", data); 
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

  /* Helpers */
  const formatPrice = (p: number) => `${p.toLocaleString()} ETB`;
const imgSrc = (url?: string) =>
  url || "/placeholder.jpg";


  /* UI states */
  if (loading)
    return (
      <section className="py-20 text-center text-gray-600">Loading …</section>
    );
  if (error)
    return (
      <section className="py-20 text-center text-red-600">{error}</section>
    );

  return (
    <section
      className="w-full h-screen m-auto relative bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50 pointer-events-none" />
      <div className="max-w-5xl m-auto relative z-10 p-6 text-white">
        <h2 className="text-3xl font-bold text-gold mb-6">Service Catalog</h2>

        {/* Loop through known category list */}
        {Object.entries(categoryHeadings).map(([catKey, meta]) => {
          const grouped = services.filter((s) => s.category === catKey);
          if (!grouped.length) return null;

          return (
            <details
              key={catKey}
              className="group border border-gray-300/40 rounded-xl mb-4 backdrop-blur-sm bg-white/5"
            >
              <summary className="p-4 flex items-center justify-between cursor-pointer">
                <span className="text-lg font-semibold group-open:text-gold">
                  {meta.letter} {meta.label}
                </span>
                <svg
                  className="w-5 h-5 transition-transform group-open:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </summary>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 pt-0">
               {grouped.map((srv) => (
  <div
    key={srv._id}
    className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col overflow-hidden"
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
            </details>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceCatalog;

