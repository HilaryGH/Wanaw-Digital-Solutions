import { useRef, useMemo } from "react";
import html2pdf from "html2pdf.js";
import QRCode from "react-qr-code";

interface GiftRecipient {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  itemTitle?: string;
  price?: number;
}

interface ServiceProvider {
  name: string;
  tin?: string;
  address?: string;
}

interface DownloadableInvoiceProps {
  fullName: string; // Buyer / sender full name
  email: string; // Buyer / sender email
  cart?: { title: string; price: number }[];
  total: number;
  giftRecipient?: GiftRecipient;
  provider?: ServiceProvider;
}

const DownloadableInvoice = ({
  fullName,
  email,
  cart = [],
  total,
  giftRecipient,
  provider,
}: DownloadableInvoiceProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);

  const getDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0].replace(/-/g, "");
  };

  const invoiceNumber = useMemo(() => {
    const initials = getInitials(fullName || "User");
    const date = getDate();
    const unique = Date.now().toString().slice(-6);
    return `INV-${initials}-${date}-${unique}`;
  }, [fullName]);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    try {
      await html2pdf()
        .set({
          margin: 10,
          filename: `${invoiceNumber}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(invoiceRef.current)
        .save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Sorry, something went wrong while generating the PDF.");
    }
  };

  return (
    <div>
      {/* Invoice Container */}
      <div
        ref={invoiceRef}
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          maxWidth: "42rem",
          marginLeft: "auto",
          marginRight: "auto",
          fontFamily: "'Segoe UI', sans-serif",
          color: "#1c2b21",
          borderTop: "6px solid #D4AF37",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <img
            src="/WHW.jpg"
            alt="WHW Logo"
            style={{
              height: "4rem",
              width: "4rem",
              objectFit: "cover",
              borderRadius: "9999px",
            }}
          />
          <div style={{ textAlign: "right" }}>
            <p>Invoice Date: {new Date().toLocaleDateString()}</p>
            <p>Invoice #: {invoiceNumber}</p>
          </div>
        </div>

        {/* Company Info */}
        <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
          <p>
            <strong>Company:</strong> Wanaw Health and Wellness Digital Solutions
          </p>
          <p>
            <strong>TIN:</strong> 0086928365
          </p>
          <p>
            <strong>Address:</strong> Addis Ababa, Ethiopia
          </p>
          <p>
            <strong>Phone:</strong> +251 989 177 777
          </p>
        </div>

        {/* Service Provider Info */}
        {provider && (
          <div
            style={{
              marginBottom: "1rem",
              fontSize: "0.875rem",
              borderTop: "1px dashed #d1d5db",
              paddingTop: "0.75rem",
            }}
          >
            <p>
              <strong>Service Provider Name:</strong> {provider.name}
            </p>
            <p>
              <strong>Provider TIN:</strong> {provider.tin || "N/A"}
            </p>
            <p>
              <strong>Provider Address:</strong> {provider.address || "N/A"}
            </p>
          </div>
        )}

        {/* Buyer / Sender Info */}
        <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
          <p>
            <strong>Customer Name:</strong> {fullName}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Status:</strong> ✅ Completed
          </p>
        </div>

        {/* Render Cart Table or Gift Recipient */}
        {cart.length > 0 ? (
          <table
            style={{
              width: "100%",
              fontSize: "0.875rem",
              borderCollapse: "collapse",
              marginBottom: "1rem",
            }}
          >
            <thead style={{ backgroundColor: "#f3f4f6", color: "#1f2937" }}>
              <tr>
                <th style={{ padding: "0.5rem", border: "1px solid #d1d5db", textAlign: "left" }}>
                  #
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #d1d5db", textAlign: "left" }}>
                  Item
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #d1d5db", textAlign: "left" }}>
                  Price (ETB)
                </th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}>{index + 1}</td>
                  <td style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}>{item.title}</td>
                  <td style={{ padding: "0.5rem", border: "1px solid #d1d5db" }}>{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : giftRecipient ? (
          <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
            <p>
              <strong>Gift Recipient:</strong> {giftRecipient.name}
            </p>
            <p>
              <strong>Recipient Email:</strong> {giftRecipient.email}
            </p>
            {giftRecipient.phone && (
              <p>
                <strong>Phone:</strong> {giftRecipient.phone}
              </p>
            )}
            {giftRecipient.itemTitle && (
              <p>
                <strong>Gift Item:</strong> {giftRecipient.itemTitle}
              </p>
            )}
            {giftRecipient.price !== undefined && (
              <p>
                <strong>Gift Price:</strong> {giftRecipient.price.toFixed(2)} ETB
              </p>
            )}
            {giftRecipient.message && (
              <p>
                <strong>Message:</strong> {giftRecipient.message}
              </p>
            )}
          </div>
        ) : (
          <p style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>No purchase or gift details available.</p>
        )}

        {/* Total Amount */}
        <div style={{ textAlign: "right", fontWeight: "600", fontSize: "1rem" }}>
          Total Paid Amount: {total.toFixed(2)} ETB
        </div>

        {/* QR Code */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem" }}>
            Scan to verify this invoice
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <QRCode value={`https://wanaw.com/invoice?code=${invoiceNumber}`} size={80} />
          </div>
        </div>

        {/* Gold Ribbon Footer */}
        <div
          style={{
            height: "30px",
            background: "linear-gradient(to right, #D4AF37, #f5deb3)",
            marginTop: "1.5rem",
            borderBottomLeftRadius: "0.5rem",
            borderBottomRightRadius: "0.5rem",
          }}
        />
      </div>

      {/* Download Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: "#1c2b21",
            color: "#D4AF37",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            transition: "border-radius 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderRadius = "9999px")}
          onMouseLeave={(e) => (e.currentTarget.style.borderRadius = "0.375rem")}
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default DownloadableInvoice;









