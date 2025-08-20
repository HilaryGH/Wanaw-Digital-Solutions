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
    <div
      style={{
        width: "380px",
        minHeight: "240px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        color: "#333",
        border: "2px solid #ccc",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        padding: "16px",
      }}
    >
      {/* Header */}
      <h2 style={{ margin: "5px 0", fontSize: "22px", fontWeight: "bold" }}>
        Gift Card
      </h2>
      <p style={{ margin: "5px 0", fontSize: "18px" }}>To: {recipientName}</p>
      <p style={{ margin: "5px 0", fontSize: "16px" }}>
        From: <strong>{senderName}</strong>
      </p>

      {/* Gift code */}
      <div
        style={{
          margin: "10px 0",
          padding: "10px 15px",
          border: "2px dashed #ccc",
          borderRadius: "8px",
        }}
      >
        <p style={{ fontSize: "16px", margin: 0 }}>🎉 Gift Code:</p>
        <p
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "2px",
            margin: "5px 0 0",
          }}
        >
          {code}
        </p>
      </div>

      {/* Service details */}
      <div style={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
        {serviceTitle && <p style={{ margin: "2px 0" }}>Service: {serviceTitle}</p>}
        {serviceCategory && <p style={{ margin: "2px 0" }}>Category: {serviceCategory}</p>}
        {serviceProvider && <p style={{ margin: "2px 0" }}>Provider: {serviceProvider}</p>}
        {serviceLocation && <p style={{ margin: "2px 0" }}>Location: {serviceLocation}</p>}
        {message && <p style={{ margin: "2px 0", fontStyle: "italic" }}>Message: {message}</p>}
      </div>

      {/* Motto */}
      <p
        style={{
          marginTop: "10px",
          fontStyle: "italic",
          fontSize: "13px",
          textAlign: "center",
        }}
      >
        “Your wellness, our purpose”
      </p>

      {/* Footer (contact info) */}
      <div
        style={{
          borderTop: "1px solid #ccc",
          paddingTop: "8px",
          marginTop: "8px",
          textAlign: "center",
          fontSize: "12px",
          lineHeight: "1.4",
        }}
      >
        <p style={{ margin: "2px 0" }}>📞 Phone: +251-900-000-000</p>
        <p style={{ margin: "2px 0" }}>📧 Email: support@wanawhealth.com</p>
        <p style={{ margin: "2px 0" }}>🌐 Website: wanawhealthandwellness.netlify.app</p>
      </div>
    </div>
  );
};

export default BasicGiftCard;

