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
}) => {
  return (
    <div
      style={{
        width: "400px",
        borderRadius: "20px",
        background: "linear-gradient(145deg, #fffaf5, #fff3e0)",
        padding: "25px",
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <h2 style={{ fontSize: "26px", color: "#D4AF37", marginBottom: "15px", fontWeight: "700", letterSpacing: "1px" }}>
        VIP Gift Card
      </h2>

      {/* Recipient Info */}
      <div style={{ width: "100%", textAlign: "left", marginBottom: "15px" }}>
        <p style={{ fontSize: "16px", margin: "3px 0" }}><strong>To:</strong> {recipientName}</p>
        <p style={{ fontSize: "16px", margin: "3px 0" }}><strong>From:</strong> {senderName}</p>
        {recipientEmail && <p style={{ fontSize: "14px", color: "#555", margin: "2px 0" }}><strong>Email:</strong> {recipientEmail}</p>}
        {recipientPhone && <p style={{ fontSize: "14px", color: "#555", margin: "2px 0" }}><strong>Phone:</strong> {recipientPhone}</p>}
        {providerName && <p style={{ fontSize: "14px", color: "#555", margin: "2px 0" }}><strong>Provider:</strong> {providerName}</p>}
      </div>

      {/* Gift Code Box */}
      <div
        style={{
          width: "90%",
          padding: "15px 20px",
          backgroundColor: "#fff8f0",
          border: "2px dashed #D4AF37",
          borderRadius: "12px",
          textAlign: "center",
          marginBottom: "20px",
          boxShadow: "inset 0 0 10px rgba(212,175,55,0.2)",
        }}
      >
        <p style={{ fontSize: "18px", color: "#D4AF37", margin: "0", fontWeight: "600" }}>🎉 Gift Code</p>
        <p style={{ fontSize: "32px", fontWeight: "700", margin: "8px 0 0" }}>{code}</p>
      </div>

      {/* Service Info */}
      <div style={{ width: "100%", textAlign: "left", marginBottom: "20px" }}>
        <p style={{ margin: "4px 0", fontSize: "15px", color: "#555" }}><strong>Service Provider:</strong> {serviceProvider}</p>
        <p style={{ margin: "4px 0", fontSize: "15px", color: "#555" }}><strong>Service Title:</strong> {serviceTitle}</p>
        <p style={{ margin: "4px 0", fontSize: "15px", color: "#555" }}><strong>Category:</strong> {serviceCategory}</p>
        <p style={{ margin: "4px 0", fontSize: "15px", color: "#555" }}><strong>Location:</strong> {serviceLocation}</p>
        <p style={{ marginTop: "10px", fontStyle: "italic", fontSize: "14px", color: "#666" }}>
          {message || "No personal message included."}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          paddingTop: "15px",
          borderTop: "1px solid #D4AF37",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "3px 0", fontSize: "14px", color: "#1c2b21", fontWeight: "600" }}>
          <a href="https://wanawhealthandwellness.netlify.app/" target="_blank" style={{ color: "#D4AF37", textDecoration: "none" }}>www.wanawhealthandwellness.netlify.app</a>
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px", color: "#1c2b21" }}>📞 +251 912 345 678</p>
        <p style={{ margin: "3px 0", fontSize: "14px", color: "#1c2b21" }}>✉️ info@wanaw.com</p>
      </div>
    </div>
  );
};

export default VipGiftCard;


