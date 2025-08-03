import { Link, useNavigate } from "react-router-dom";

export default function Cards() {
  const navigate = useNavigate();

  const handlePartnerClick = () => navigate("/partner-with-us");
  const handleCareerClick = () => navigate("/careers");

  return (
    <section className="py-16 px-4 md:px-10 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <h2 className="text-4xl font-bold text-center text-[#1c2b21] mb-14">
        Work with <span className="text-yellow-500">Wanaw</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {/* Partner With Us */}
        <div
          onClick={handlePartnerClick}
          className="group cursor-pointer bg-white border-l-4 border-[#1c2b21] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          <h3 className="text-2xl font-semibold text-[#1c2b21] mb-3 group-hover:text-yellow-500 transition-colors">
            Invest/Partner With Us
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Are you an investor, VC, business company, healthcare service provider, or technology solutions provider? Join Wanaw to grow together.
          </p>
          <button className="mt-5 text-[#1c2b21] font-medium hover:text-yellow-500 transition-colors">
            Become a Partner →
          </button>
        </div>

        {/* Membership */}
        {/* Membership */}
<div className="bg-white border-l-4 border-yellow-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
  <h3 className="text-2xl font-semibold text-[#1c2b21] mb-3 hover:text-yellow-500 transition-colors">
    Join the Community
  </h3>
  <p className="text-gray-600 leading-relaxed">
    Are you Diaspora, Individual seeking to provide support & volunteer, Healthcare Professional, or a Fresh Graduate? Join Wanaw Community to connect, collaborate, and contribute.
  </p>
  <Link
    to="/community"
    className="mt-5 inline-block text-yellow-500 font-semibold hover:underline"
  >
    Become a Member →
  </Link>
  <a
    href="https://www.linkedin.com/company/wanaw-health-and-wellness-digital-solution/"
    target="_blank"
    rel="noopener noreferrer"
    className="block mt-3 text-sm text-blue-600 hover:underline"
  >
    Follow us on LinkedIn
  </a>
</div>


        {/* Career Openings */}
        <div
          onClick={handleCareerClick}
          className="group cursor-pointer bg-white border-l-4 border-[#1c2b21] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          <h3 className="text-2xl font-semibold text-[#1c2b21] mb-3 group-hover:text-yellow-500 transition-colors">
            Career Openings
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Looking for a full-time or freelance opportunity? Explore open roles and join our team.
          </p>
          <button className="mt-5 text-[#1c2b21] font-medium hover:text-yellow-500 transition-colors">
            View Openings →
          </button>
          <a
            href="https://www.linkedin.com/company/wanaw-health-and-wellness-digital-solution/"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 text-sm text-blue-600 hover:underline"
          >
            See jobs on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

