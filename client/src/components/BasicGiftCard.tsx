import React from "react";

interface BasicGiftCardProps {
  recipientName: string;
  code: string;
  senderName: string;
  serviceTitle?: string;
  serviceCategory?: string;
  serviceProvider?: string;
  serviceLocation?: string;
  message?: string;
}

const BasicGiftCard: React.FC<BasicGiftCardProps> = ({
  recipientName,
  code,
  senderName,
  serviceTitle,
  serviceCategory,
  serviceProvider,
  serviceLocation,
  message,
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#fffaf5] to-[#fff3e0] rounded-2xl shadow-2xl p-6 sm:p-8 font-poppins relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#1c2b21] rounded-full opacity-20 animate-spin-slow"></div>
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-gradient-to-tr from-[#D4AF37] to-[#1c2b21] rounded-full opacity-20 animate-pulse"></div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-[#D4AF37] text-center mb-4">Gift Card</h2>

      {/* Recipient Info */}
      <div className="text-center mb-6 space-y-1">
        <p className="text-gray-800 font-medium">To: {recipientName}</p>
        <p className="text-gray-800 font-medium">From: {senderName}</p>
      </div>

      {/* Gift Code Box */}
      <div className="w-full bg-[#fff4e6] border-2 border-dashed border-[#D4AF37] rounded-xl py-3 flex flex-col items-center mb-6 shadow-inner">
        <p className="text-[#D4AF37] font-semibold text-lg">🎉 Gift Code</p>
        <p className="text-2xl font-bold text-[#1c2b21] mt-1">{code}</p>
      </div>

      {/* Service Details */}
      <div className="text-center mb-4 space-y-1 text-gray-600 text-sm">
        {serviceTitle && <p>Service: {serviceTitle}</p>}
        {serviceCategory && <p>Category: {serviceCategory}</p>}
        {serviceProvider && <p>Provider: {serviceProvider}</p>}
        {serviceLocation && <p>Location: {serviceLocation}</p>}
        {message && <p className="italic">Message: {message}</p>}
      </div>

      {/* Motto */}
      <p className="text-center italic text-gray-500 mb-4">“Your wellness, our purpose”</p>

      {/* Footer */}
      <div className="w-full border-t border-[#D4AF37] pt-4 text-center space-y-1 text-gray-800 text-sm">
        <p>📞 +251-989-177-777</p>
        <p>📧 support@wanawhealth.com</p>
        <p>🌐 <a href="https://wanawhealthandwellness.netlify.app/" target="_blank" className="text-[#D4AF37] hover:underline">wanawhealthandwellness.netlify.app</a></p>
      </div>
    </div>
  );
};

export default BasicGiftCard;


