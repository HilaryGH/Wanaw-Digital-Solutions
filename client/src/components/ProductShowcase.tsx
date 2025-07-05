import { FaDumbbell, FaLeaf, FaAppleAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const productData = [
  {
    title: "Fitness Equipment",
    icon: <FaDumbbell className="text-5xl text-blue-600" />,
    description: "Wearables, gym tools, and home fitness gear.",
    link: "/products#fitness",
  },
  {
    title: "Wellness Products",
    icon: <FaLeaf className="text-5xl text-green-600" />,
    description: "Essential oils, sleep aids & stress relief kits.",
    link: "/products#wellness",
  },
  {
    title: "Nutritional Products",
    icon: <FaAppleAlt className="text-5xl text-red-500" />,
    description: "Supplements, healthy snacks & guides.",
    link: "/products#nutrition",
  },
];

const ProductShowcase = () => {
  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productData.map((product, idx) => (
          <Link
            to={product.link}
            key={idx}
            className="group bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 text-center"
          >
            <div className="mb-4 flex justify-center">{product.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600">{product.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
