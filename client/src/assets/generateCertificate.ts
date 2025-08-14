import jsPDF from "jspdf";
import QRCode from "qrcode";

export async function generateCertificate({
  name,
  role,
  level, // renamed from tier
  qrData, // any string or URL to encode
  logoUrl = "/WHW.jpg", // default logo path
}: {
  name: string;
  role: string;
  level?: string;
  qrData?: string;
  logoUrl?: string;
}) {
  const doc = new jsPDF("landscape");

  // 🎨 Brand Colors
  const brandDark: [number, number, number] = [28, 43, 33]; // #1c2b21
  const brandGold: [number, number, number] = [212, 175, 55]; // #D4AF37

  // 📄 Border
  doc.setDrawColor(...brandDark);
  doc.setLineWidth(4);
  doc.rect(10, 10, 277, 190);

  // 🖼 Logo
  try {
    if (logoUrl) {
      doc.addImage(logoUrl, "JPEG", 125, 20, 40, 40); // center top
    }
  } catch (err) {
    console.warn("Logo not loaded:", err);
  }

  // 🏷 Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(...brandDark);
  doc.text("Certificate of Recognition", 148.5, 75, { align: "center" });

  // ✨ Presented to
  doc.setFontSize(16);
  doc.setTextColor(...brandDark);
  doc.text("This is proudly presented to", 148.5, 95, { align: "center" });

  // 👤 Name
  doc.setFontSize(26);
  doc.setFont("times", "bold");
  doc.setTextColor(...brandGold);
  doc.text(name, 148.5, 120, { align: "center" });

  // 📌 Role & Level
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...brandDark);
  const levelText = level ? ` (${level})` : "";
  doc.text(`as ${role}${levelText}`, 148.5, 135, { align: "center" });

  // 📝 Tagline based on role
  const roleTaglines: Record<string, string> = {
    "Healthcare Professionals": "for outstanding dedication in the healthcare sector.",
    Gifters: "for generous contributions to Hemodialysis patients.",
    Influencers: "for amplifying awareness and inspiring change.",
    "Brand Ambassadors": "for representing the Wanaw Support Community.",
    "Service Providers": "for delivering essential healthcare services.",
    Volunteers: "for dedicated volunteer service.",
    "Internship Program": "for successfully completing the Internship Program.",
  };
  doc.setFontSize(14);
  doc.text(roleTaglines[role] || "for valuable contributions to our community.", 148.5, 150, { align: "center", maxWidth: 240 });

  // 📅 Footer with date
  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 148.5, 175, { align: "center" });

  // 🪙 Official Seal
  doc.setDrawColor(...brandGold);
  doc.setFillColor(...brandGold);
  doc.circle(240, 165, 15, "FD");
  doc.setFontSize(10);
  doc.setTextColor(...brandDark); // ✅ brand green instead of white
  doc.text("Wanaw", 240, 165, { align: "center", baseline: "middle" });

  // 🔳 Add QR Code if provided
  if (qrData) {
    try {
      const qrUrl = await QRCode.toDataURL(qrData);
      doc.addImage(qrUrl, "PNG", 20, 155, 35, 35); // bottom-left corner
    } catch (err) {
      console.error("QR code generation failed:", err);
    }
  }

  // 💾 Download
  doc.save(`${name}-certificate.pdf`);
}


