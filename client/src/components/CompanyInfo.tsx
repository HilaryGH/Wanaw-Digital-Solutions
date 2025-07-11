

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
      <p className="leading-relaxed text-sm md:text-lg ">
        Wanaw Health and Wellness (WHW) provides a seamless, efficient, and user-friendly
         platform for discovering, booking, and managing a wide range of health and wellness 
         services, including gifting options and gift card generation.
      </p>
      <p className="mt-4 text-sm md:text-lg">
        Our platform connects service seekers with certified and verified providers in categories like wellness, medical, aesthetic care, personal/self-care, hotel rooms, and more — all with real-time booking and secure payment.
      </p>
      <p className="mt-4 text-sm md:text-lg">
        With just one click, users can access tailored services in their area. Explore the simplicity of managing your health and well-being through our user-friendly platform.
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
<section className="relative text-gold px-6 py-16 overflow-hidden">
  {/* Decorative SVG top wave */}
  <div className="absolute top-0 right-0 w-full h-32 overflow-hidden leading-[0] z-10">
    <svg
      className="relative block w-full h-full"
      viewBox="0 0 500 80"
      preserveAspectRatio="none"
    >
      <path d="M500,0 C400,80 100,0 0,80 L0,0 L500,0 Z" fill="#1c2b21" />
    </svg>
  </div>

  {/* Mission & Vision content */}

    {/* Mission */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
  {/* Mission */}
  <div
    className="bg-[#D4AF37] text-black p-6 rounded-xl shadow-md"
    data-aos="slid-doen"
    data-aos-delay="100"
  >
    <h3 className="text-xl font-bold mb-2 relative inline-block after:block after:h-1 after:bg-[#D4AF37] after:w-full after:mt-1">
      Mission
    </h3>
    <p className="text-sm md:text-base">
      To empower users to easily purchase, gift, and manage a wide range of health and wellness services.
      We strive to improve overall well-being through innovation, partnerships, and community support.
    </p>
  </div>

  {/* Vision */}
  <div
    className="bg-[#D4AF37] text-black p-6 rounded-xl shadow-md"
    data-aos="slid-down"
    data-aos-delay="300"
  >
    <h3 className="text-xl font-bold mb-2 relative inline-block after:block after:h-1 after:bg-[#D4AF37] after:w-full after:mt-1">
      Vision
    </h3>
    <p className="text-sm md:text-base">
      To become the leading digital platform for health and wellness services, recognized for quality,
      accessibility, and user satisfaction by 2030.
    </p>
  </div>
</div>

</section>

     {/* Service Providers */}
<section
  className="w-full m-auto relative bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
  style={{ backgroundImage: "url('/hero.jpg')" }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div>

  {/* Content wrapper */}
  <div className="max-w-3xl m-auto relative z-10 p-6 text-white">
    <h2 className="text-2xl font-semibold text-gold mb-4">Service Providers</h2>
    <div className="space-y-4">
      <details className="group border rounded-xl border-gray-300 p-4 cursor-pointer ">
        <summary className="font-semibold text-lg group-open:text-gold">
          A. Wellness Services
        </summary>
        <ul className="pl-4 list-disc">
          <li>Gym & Fitness (GYM, Swimming Pool)</li>
          <li>Spa (Morocco Bath, Massage Therapy, Steam, etc.)</li>
          <li>Beauty Salon (Hair, Nail, Eye Lash for Women and Men)</li>
          <li>Yoga & Meditation</li>
          <li>Travel & Hiking, Wellness Camps (e.g. Wenchi Crater Lake)</li>
        </ul>
      </details>

      <details className="group border border-gray-300 rounded-xl p-4 cursor-pointer ">
        <summary className="font-semibold text-lg group-open:text-gold">B. Aesthetician</summary>
        <ul className="pl-4 list-disc">
          <li>Skin: Tattoo & Scar Removal</li>
          <li>Hair: Laser Hair Removal, Hair Transplant</li>
          <li>Nail Treatments</li>
        </ul>
      </details>

      <details className="group border border-gray-300 rounded-xl p-4 cursor-pointer ">
        <summary className="font-semibold text-lg group-open:text-gold">C. Medical</summary>
        <ul className="pl-4 list-disc">
          <li>Physiotherapy, Pharmacy</li>
          <li>Diagnostic Imaging, Laboratory Center</li>
          <li>Doctor Consultation, Nutritionist</li>
          <li>Psychologist & Counselling, Recovery Centers, Support Groups</li>
        </ul>
      </details>

      <details className="group border border-gray-300 rounded-xl p-4 cursor-pointer ">
        <summary className="font-semibold text-lg group-open:text-gold">D. Personal / Self Care</summary>
        <p className="pl-4 mt-2">Various grooming and personal care services</p>
      </details>

      <details className="group border border-gray-300 rounded-xl p-4 cursor-pointer ">
        <summary className="font-semibold text-lg group-open:text-gold">E. Lifestyle</summary>
        <ul className="pl-4 list-disc">
          <li>Traditional Clothes (Sheffon)</li>
          <li>Flower & Chocolate Shops</li>
        </ul>
      </details>

      <details className="group border border-gray-300 rounded-xl p-4 cursor-pointer ">
        <summary className="font-semibold text-lg group-open:text-gold">F. Hotel Room</summary>
        <ul className="pl-4 list-disc">
          <li>3 to 5 Star Hotels: Standard to Presidential Rooms</li>
          <li>Pensions</li>
        </ul>
      </details>
    </div>
  </div>
</section>

     </div>
     </>
  );
};

export default CompanyInfo;
