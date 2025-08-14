import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api";

// Interfaces
interface Recipient {
  name?: string;
  email?: string;
  phone?: string;
}

interface Service {
  title?: string;
  category?: string;
}

interface Provider {
  name?: string;
}

interface GiftCode {
  _id: string;
  giftCode: string;
  giftId: string;
  recipient?: Recipient;
  service?: Service;
  providerId?: Provider;
  deliveryStatus?: string;
  createdAt: string;
}

interface Filters {
  status: string;
  providerName: string;
  dateFrom: string;
  dateTo: string;
}

const AdminGiftCodes: React.FC = () => {
  const [codes, setCodes] = useState<GiftCode[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    providerName: "",
    dateFrom: "",
    dateTo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch gift codes from backend
  const fetchCodes = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Admin token not found. Please log in.");
        setLoading(false);
        return;
      }

      const { data } = await axios.get<GiftCode[]>(
        `${BASE_URL}/gift/codes`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCodes(data || []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.msg || err.message);
      } else {
        setError("Unexpected error fetching gift codes.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter input changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Apply filters
  const applyFilters = () => {
    fetchCodes();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎁 Gift Codes Management</h2>

      {/* Filters */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>

        <input
          type="text"
          name="providerName"
          placeholder="Provider Name"
          value={filters.providerName}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
        />

        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      {/* Loading / Error / Table */}
      {loading ? (
        <p>Loading gift codes...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table
          border={1}
          cellPadding={8}
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>Gift Code</th>
              <th>Gift ID</th>
              <th>Recipient</th>
              <th>Service</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {codes.length > 0 ? (
              codes.map((code) => (
                <tr key={code._id}>
                  <td>{code.giftCode}</td>
                  <td>{code.giftId}</td>
                  <td>{code.recipient?.name || "N/A"}</td>
                  <td>{code.service?.title || "N/A"}</td>
                  <td>{code.providerId?.name || "N/A"}</td>
                  <td>{code.deliveryStatus || "pending"}</td>
                  <td>{new Date(code.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No gift codes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminGiftCodes;




