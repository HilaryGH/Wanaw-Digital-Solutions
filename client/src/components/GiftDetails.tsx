import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

type Gift = {
  _id: string;
  title: string;
  category: string;
  occasion?: string;
  description?: string;
  imageUrl?: string;
};

const GiftDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gift, setGift] = useState<Gift | null>(null);
  const [relatedGifts, setRelatedGifts] = useState<Gift[]>([]);
  const navigate = useNavigate();

  const slugify = (text: string) =>
    text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

  useEffect(() => {
    const fetchGiftDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/gift`);
        const data: Gift[] = await res.json();

        const matchedGift = data.find(
          (g) => slugify(g.title) === slug
        );

        if (matchedGift) {
          setGift(matchedGift);

          // Fetch related gifts (same category, excluding current gift)
          const related = data.filter(
            (g) =>
              g.category.toLowerCase() === matchedGift.category.toLowerCase() &&
              g._id !== matchedGift._id
          );
          setRelatedGifts(related);
        } else {
          setGift(null);
        }
      } catch (err) {
        console.error("Error fetching gift details:", err);
      }
    };

    fetchGiftDetails();
  }, [slug]);

  const handleSendGift = (gift: Gift) => {
    navigate("/send-gift", { state: { service: gift } });
  };

  if (!gift) return <div className="p-6">Gift not found.</div>;

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-10 px-6 md:px-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-12">
        {gift.imageUrl && (
          <img
            src={`${BASE_URL.replace("/api", "")}${gift.imageUrl}`}
            alt={gift.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-3xl font-bold text-[#1c2b21] mb-2">{gift.title}</h1>
        <p className="text-sm text-gray-500 mb-1">Category: {gift.category}</p>
        {gift.occasion && <p className="text-sm text-gray-500 mb-1">Occasion: {gift.occasion}</p>}
        {gift.description && <p className="text-base mt-4 text-gray-700">{gift.description}</p>}

        <button
          onClick={() => handleSendGift(gift)}
          className="mt-6 w-full bg-[#D4AF37] text-[#1c2b21] font-medium py-2 rounded-md hover:bg-[#caa82f] transition"
        >
          Send Gift
        </button>
      </div>

   {relatedGifts.length > 0 && (
  <div className="max-w-5xl mx-auto">
    <h2 className="text-2xl font-semibold text-[#1c2b21] mb-6">Related Gifts</h2>
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {relatedGifts.map((item) => (
        <div
          key={item._id}
          className="bg-white border rounded-xl p-4 transition duration-300 shadow hover:shadow-lg flex flex-col"
        >
          <div
            onClick={() => navigate(`/gifts/${slugify(item.title)}`)}
            className="cursor-pointer"
          >
            {item.imageUrl && (
              <img
               src={`${BASE_URL.replace("/api", "")}${item.imageUrl}`}
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h3 className="text-lg font-semibold hover:underline">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.occasion}</p>
          </div>

          <button
            onClick={() => handleSendGift(item)}
            className="mt-4 bg-[#D4AF37] text-[#1c2b21] text-sm font-medium py-2 rounded-md hover:bg-[#caa82f] transition"
          >
            Send This Gift
          </button>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default GiftDetails;
