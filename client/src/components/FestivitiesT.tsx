function FestivitiesT() {
  return (
    <div className="relative w-full h-screen bg-[#1c2b21] overflow-hidden">
      {/* Background image */}
      <img
        src="/Festivities.svg"
        alt="Festivities Hero"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Bottom overlay container */}
      <div className="absolute w-full h-1/3 bottom-0 left-0 bg-black/60 text-gold z-10 shadow-lg text-center flex flex-col justify-center px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Festivals of Ethiopia
        </h2>
        <p className="text-sm md:text-base mb-4">
          Let’s celebrate culture, heritage, and unity.
        </p>

        {/* Responsive scrolling or wrapping */}
        <div className="scroll-container md:overflow-hidden overflow-x-auto">
          <div className="scroll-content md:animate-scroll-left flex md:flex-nowrap flex-wrap justify-center md:gap-6 gap-4 px-2 md:px-0">
            <div className="festival-block shadow-lg border border-[#D4AF37] w-40 sm:w-44 md:w-48 lg:w-56">
              <h3 className="text-sm md:text-lg font-semibold">Ashenda</h3>
              <p className="text-xs mt-1">
                A celebration of girlhood, music, and tradition in Tigray.
              </p>
            </div>
            <div className="festival-block shadow-lg border border-[#D4AF37] w-40 sm:w-44 md:w-48 lg:w-56">
              <h3 className="text-sm md:text-lg font-semibold">Irreechaa</h3>
              <p className="text-xs mt-1">
                Oromo thanksgiving festival honoring nature and unity.
              </p>
            </div>
            <div className="festival-block shadow-lg border border-[#D4AF37] w-40 sm:w-44 md:w-48 lg:w-56">
              <h3 className="text-sm md:text-lg font-semibold">Meskel</h3>
              <p className="text-xs mt-1">
                The finding of the True Cross, celebrated with bonfires.
              </p>
            </div>
            <div className="festival-block shadow-lg border border-[#D4AF37] w-40 sm:w-44 md:w-48 lg:w-56">
              <h3 className="text-sm md:text-lg font-semibold">Timket</h3>
              <p className="text-xs mt-1">
                Epiphany celebration with processions and holy water.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FestivitiesT;
