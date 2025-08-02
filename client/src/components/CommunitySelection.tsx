import { useNavigate } from "react-router-dom";

export default function CommunitySelection() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Join a Community</h2>

      <div className="grid gap-4">
        <button
          onClick={() => navigate("/community/kidney")}
          className="w-full px-6 py-4 bg-[#D4AF37] text-[#1c2b21] rounded-xl hover:rounded-full transition"
        >
          Kidney Patient Community
        </button>

        <button
          onClick={() => navigate("/community/membership")}
          className="w-full px-6 py-4 bg-green text-gold rounded-xl hover:rounded-full transition"
        >
          Wanaw Community Membership
        </button>
      </div>
    </div>
  );
}
