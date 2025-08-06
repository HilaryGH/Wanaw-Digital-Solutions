
import ServiceCatalog from "./ServiceCatalog";


const CompanyInfo = () => {
  return (
    <>
     {/* Decorative SVG top wave */}
  <div className="absolute top-25 right-0 w-full h-32 overflow-hidden leading-[0] z-10">
    <svg
      className="relative block w-full h-full"
      viewBox="0 0 500 80"
      preserveAspectRatio="none"
    >
      <path d="M500,0 C400,80 100,0 0,80 L0,0 L500,0 Z" fill="#1c2b21" />
    </svg>
  </div>
    <div className="bg-white text-gray-800  mx-auto space-y-10">
      {/* Header */}
      <section className="text-center ">
  
        <h1 className="text-3xl md:text-4xl font-bold mt-16 mb-6 text-[#1c2b21]">
          Wanaw Health and Wellness Digital Solution
        </h1>
        <p className="text-lg md:text-xl font-medium text-gold">
          "Your Wellness, Our Purpose"
        </p>
      </section>
{/* About */}
<section className="relative bg-[#D4AF37] h-auto w-full pt-20 pb-24 px-6 sm:px-10 md:px-20 overflow-hidden">
  {/* 🔷 Top-Right Curved Cutout */}
  <div className="absolute top-0 right-0 w-full h-32 overflow-hidden leading-[0]">
    <svg
      className="relative block w-full h-full"
      viewBox="0 0 500 80"
      preserveAspectRatio="none"
    >
      <path d="M500,0 C400,80 100,0 0,80 L0,0 L500,0 Z" fill="white" />
    </svg>
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
    {/* Text Content */}
    <div className="md:w-1/2 text-[#1c2b21]">
      <h2 className="text-3xl font-bold mb-4 relative inline-block after:block after:h-1 after:bg-green after:w-full after:mt-1 ">About 
</h2>
    <p className="leading-relaxed text-sm md:text-lg">
  Wanaw Health and Wellness (WHW) provides a seamless, efficient, and user-friendly platform for discovering, booking, and managing a wide range of health and wellness services — including gifting options and gift card generation.
</p>
<p className="mt-4 text-sm md:text-lg">
  Our platform connects service seekers with certified and verified providers in categories like wellness, medical care, aesthetic treatments, personal/self-care, hotel rooms, and more — all with real-time booking and secure payments.
</p>
<p className="mt-4 text-sm md:text-lg">
  With just one click, users can access tailored services in their area. Experience the simplicity of managing your health and well-being through our all-in-one platform.
</p>
</div>
    {/* GIF Image */}
    <div className="md:w-1/2">
      <img
        src="/Healthy.gif"
        alt="Health and wellness animation"
        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
      />
    </div>
  </div>
</section>

{/* Mission & Vision */}
<section className="relative px-6 sm:px-10 md:px-20 py-20 bg-[#1c2b21] text-white overflow-hidden">
  {/* Decorative Top Wave */}
  <div className="absolute top-0 right-0 w-full h-32 overflow-hidden leading-[0] z-0">
    <svg
      className="relative block w-full h-full"
      viewBox="0 0 500 80"
      preserveAspectRatio="none"
    >
      <path d="M500,0 C400,80 100,0 0,80 L0,0 L500,0 Z" fill="#ffffff" />
    </svg>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-14 text-gold">
      Our Mission & Vision
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Mission Card */}
      <div className="bg-white text-[#1c2b21] p-8 rounded-2xl shadow-lg border-l-8 border-[#D4AF37] hover:shadow-2xl transition">
        <h3 className="text-xl md:text-2xl font-bold mb-4 relative">
          <span className="inline-block pb-1 border-b-4 border-[#D4AF37]">Mission</span>
        </h3>
        <p className="text-sm md:text-base leading-relaxed">
          To empower users to easily purchase, gift, and manage a wide range of health and wellness services. We strive to improve overall well-being through innovation, partnerships, and community support.
        </p>
      </div>

      {/* Vision Card */}
      <div className="bg-white text-[#1c2b21] p-8 rounded-2xl shadow-lg border-l-8 border-[#D4AF37] hover:shadow-2xl transition">
        <h3 className="text-xl md:text-2xl font-bold mb-4 relative">
          <span className="inline-block pb-1 border-b-4 border-[#D4AF37]">Vision</span>
        </h3>
        <p className="text-sm md:text-base leading-relaxed">
          To become the leading digital platform for health and wellness services, recognized for quality, accessibility, and user satisfaction by 2030.
        </p>
      </div>
    </div>
  </div>
</section>



  <ServiceCatalog/>


     </div>
     </>
  );
};

export default CompanyInfo;
