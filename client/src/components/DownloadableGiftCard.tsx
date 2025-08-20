import { useRef } from "react";
import html2pdf from "html2pdf.js";
import QRCode from "react-qr-code";

interface GiftCardProps {
  senderName: string;
  recipientName: string;
  giftItem?: string;
  message?: string;
  giftCode?: string;
  amount?: number;
}

const DownloadableGiftCard = ({
  senderName,
  recipientName,
  giftItem,
  message,
  giftCode,
  amount,
}: GiftCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      await html2pdf()
        .set({
          margin: 10,
          filename: `GiftCard-${giftCode || Date.now()}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a5", orientation: "landscape" },
        })
        .from(cardRef.current)
        .save();
    } catch (error) {
      console.error("Gift card download failed:", error);
      alert("Failed to generate the gift card.");
    }
  };

  return (
    <div>
      <div
        ref={cardRef}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "1.5rem",
          border: "2px solid #D4AF37",
          borderRadius: "1rem",
          textAlign: "center",
          fontFamily: "'Segoe UI', sans-serif",
          backgroundColor: "#fdf6e3",
          margin: "0 auto",
        }}
      >
        <h2 style={{ color: "#D4AF37" }}>🎁 E-Gift Card</h2>
        <p>
          <strong>From:</strong> {senderName}
        </p>
        <p>
          <strong>To:</strong> {recipientName}
        </p>
        {giftItem && (
          <p>
            <strong>Gift Item:</strong> {giftItem}
          </p>
        )}
        {amount !== undefined && (
          <p>
            <strong>Value:</strong> {amount.toFixed(2)} ETB
          </p>
        )}
        {message && (
          <p style={{ fontStyle: "italic", marginTop: "0.5rem" }}>
            "{message}"
          </p>
        )}
        {giftCode && (
          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#D4AF37" }}>
            Gift Code: {giftCode}
          </p>
        )}
        {giftCode && (
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
            <QRCode value={`https://wanaw.com/redeem?code=${giftCode}`} size={100} />
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: "#1c2b21",
            color: "#D4AF37",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Download Gift Card
        </button>
      </div>
    </div>
  );
};

export default DownloadableGiftCard;
