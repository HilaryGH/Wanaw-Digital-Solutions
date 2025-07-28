import { Link } from "react-router-dom";

export default function CustomerSupportDashboard() {
  const features = [
    {
      title: "Support Requests",
      description: "View and manage support tickets.",
      route: "/admin/support-requests",
      color: "bg-red-100",
    },
    {
      title: "Applicants List",
      description: "View job applicants.",
      route: "/admin/applicant-list",
      color: "bg-blue-100",
    },
     {
      title: "Gift List & confirm",
      description: "View job applicants.",
      route: "/admin/gift-list & confirm",
      color: "bg-blue-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Customer Support Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow hover:shadow-md transition-all duration-300 ${item.color}`}
          >
            <h2 className="text-lg font-semibold mb-2 text-[#1c2b21]">
              {item.title}
            </h2>
            <p className="text-sm text-gray-700 mb-4">{item.description}</p>
            <Link
              to={item.route}
              className="inline-block bg-[#1c2b21] text-white px-4 py-2 rounded hover:bg-[#16241a] text-sm"
            >
              Go to {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
