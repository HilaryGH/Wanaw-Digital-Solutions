import React from "react";

interface VipGiftCardProps {
  recipientName: string;
  code: string;
  senderName: string;
  serviceTitle: string;
  serviceCategory: string;
  serviceProvider: string;
  serviceLocation: string;
  message: string;
  recipientEmail?: string;
  recipientPhone?: string;
  providerName?: string;
  photo?: string; // new
}

const VipGiftCard: React.FC<VipGiftCardProps> = ({
  recipientName,
  code,
  senderName,
  serviceTitle,
  serviceCategory,
  serviceProvider,
  serviceLocation,
  message,
  recipientEmail,
  recipientPhone,
  providerName,
  photo, // new
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#fff8f0] to-[#fff1e6] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center font-poppins relative overflow-hidden">
      {/* Decorative Brand Circles */}
      <div className="absolute -top-16 -left-16 w-36 h-36 bg-gradient-to-br from-[#D4AF37] to-[#1c2b21] rounded-full opacity-20 animate-spin-slow"></div>
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-tr from-[#D4AF37] to-[#1c2b21] rounded-full opacity-20 animate-pulse"></div>

      {/* Recipient Photo */}
      {photo && (
        <img
          src={photo}
          alt={`${recipientName}'s photo`}
          className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#D4AF37]"
        />
      )}

      {/* Header */}
      <h2 className="text-3xl font-bold text-[#D4AF37] mb-4 tracking-wide">
        VIP Gift Card
      </h2>

      {/* Recipient Info */}
      <div className="w-full text-left mb-6 space-y-1">
        <p className="text-gray-800 font-medium"><strong>To:</strong> {recipientName}</p>
        <p className="text-gray-800 font-medium"><strong>From:</strong> {senderName}</p>
        {recipientEmail && <p className="text-gray-500 text-sm"><strong>Email:</strong> {recipientEmail}</p>}
        {recipientPhone && <p className="text-gray-500 text-sm"><strong>Phone:</strong> {recipientPhone}</p>}
        {providerName && <p className="text-gray-500 text-sm"><strong>Provider:</strong> {providerName}</p>}
      </div>

      {/* Gift Code Box */}
      <div className="w-full bg-[#fff4e6] border-2 border-dashed border-[#D4AF37] rounded-xl py-4 flex flex-col items-center mb-6 shadow-inner">
        <p className="text-[#D4AF37] font-semibold text-lg">🎉 Gift Code</p>
        <p className="text-3xl font-bold text-[#1c2b21] mt-1">{code}</p>
      </div>

      {/* Service Info */}
      <div className="w-full text-left mb-6 space-y-1">
        <p className="text-gray-600 text-sm"><strong>Service Provider:</strong> {serviceProvider}</p>
        <p className="text-gray-600 text-sm"><strong>Service Title:</strong> {serviceTitle}</p>
        <p className="text-gray-600 text-sm"><strong>Category:</strong> {serviceCategory}</p>
        <p className="text-gray-600 text-sm"><strong>Location:</strong> {serviceLocation}</p>
        <p className="mt-2 text-gray-500 italic text-sm">{message || "No personal message included."}</p>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-[#D4AF37] pt-4 text-center space-y-1">
        <p className="text-[#1c2b21] font-semibold text-sm">
          <a href="https://wanawhealthandwellness.netlify.app/" target="_blank" className="text-[#D4AF37] hover:underline">
            www.wanawhealthandwellness.netlify.app
          </a>
        </p>
        <p className="text-[#1c2b21] text-sm">📞  +251-989-177-777</p>
        <p className="text-[#1c2b21] text-sm">✉️ info@wanaw.com</p>
      </div>
    </div>
  );
};

export default VipGiftCard;



