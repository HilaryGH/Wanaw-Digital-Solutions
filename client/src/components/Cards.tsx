import { Link, useNavigate } from "react-router-dom";

export default function Cards() {
  const navigate = useNavigate();

  const handlePartnerClick = () => {
    navigate("/partner-with-us");
  };

  const handleCareerClick = () => {
    navigate("/careers");
  };

  return (
    <div className="py-12 px-4 md:px-10 bg-gray-50">
      <h2 className="text-3xl font-extrabold text-center text-[#1c2b21] mb-10">
        Get Involved with <span className="text-gold">Wanaw</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Partner With Us */}
        <div
          onClick={handlePartnerClick}
          className="cursor-pointer bg-white border-l-4 border-[#1c2b21] rounded-md p-6 shadow hover:shadow-lg transition duration-300"
        >
          <h3 className="text-xl font-semibold text-[#1c2b21] mb-2">Invest/Partner With Us</h3>
          <p className="text-sm text-gray-600">
            Are you a service provider, health center, or volunteer? Join Wanaw to grow together.
          </p>
          <button className="mt-4 text-[#1c2b21] font-medium hover:underline">
            Become a Partner →
          </button>
        </div>

        {/* Membership */}
        <div className="bg-white border-l-4  border-[#D4AF37] rounded-md p-6 shadow hover:shadow-lg transition duration-300">
          <h3 className="text-xl font-semibold text-[#1c2b21] mb-2">Join the Community</h3>
          <p className="text-sm text-gray-600">
            Are you a healthcare professional or fresh graduate? Apply for internships and be part of the Wanaw community.
          </p>
          <Link
            to="/community-membership"
            className="mt-4 inline-block text-[#D4AF37] font-medium hover:underline"
          >
            Become a Member →
          </Link>
        </div>

        {/* Career Openings */}
        <div
          onClick={handleCareerClick}
          className="cursor-pointer bg-white border-l-4  border-[#1c2b21] rounded-md p-6 shadow hover:shadow-lg transition duration-300"
        >
          <h3 className="text-xl font-semibold text-[#1c2b21] mb-2">Career Openings</h3>
          <p className="text-sm text-gray-600">
            Looking for a full-time or freelance opportunity? Explore open roles and join our team.
          </p>
          <button className="mt-4 text-[#1c2b21] font-medium hover:underline">
            View Openings →
          </button>
        </div>
      </div>
    </div>
  );
}
