import { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Footer = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <footer className="bg-[#1c2b21] text-white text-sm pt-10 pb-6 px-6 sm:px-10 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Grid Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img src="WHW 1.png" className="h-12 w-12 " />
            <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">
              Wanaw Health & Wellness
            </h4>
            <p className="text-gray-300">
              Your digital gateway to wellness services, gifting, and wellness
              programs across Ethiopia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:underline">
                  Services
                </a>
              </li>
              <li>
                <a href="#gifts" className="hover:underline">
                  Gift Options
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:underline">
                  Programs
                </a>
              </li>
              <li>
                <a href="#support" className="hover:underline">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#D4AF37]">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-[#D4AF37]">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-[#D4AF37]">
                <FaLinkedin />
              </a>
              <a href="#" className="hover:text-[#D4AF37]">
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">
              Subscribe
            </h4>
            <p className="text-gray-300 mb-3">
              Join our mailing list for updates and offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your Email"
                className="px-3 py-2 rounded bg-[#D4AF37] text-black text-sm w-full sm:flex-1"
              />
              <button className="bg-[#D4AF37] text-black px-4 py-2 rounded-full font-semibold text-sm hover:rounded-md">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Show More Button for Mobile */}
        <div className="mt-6 md:hidden">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 text-[#D4AF37] font-medium"
          >
            {showMore ? (
              <>
                Show Less <IoIosArrowUp />
              </>
            ) : (
              <>
                Show More <IoIosArrowDown />
              </>
            )}
          </button>

          {showMore && (
            <div className="mt-4 text-gray-400 space-y-2">
              <p>Terms & Conditions</p>
              <p>Privacy Policy</p>
              <p>Partner With Us</p>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} Wanaw Health and Wellness. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
