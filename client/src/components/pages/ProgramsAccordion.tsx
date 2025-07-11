import  { useState, useEffect } from "react";
import BASE_URL from "../../api/api";

interface Program {
  _id: string;
  title: string;
  category: string;
  image?: string;
  services: string[];
}

export default function ProgramsAccordion() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filtered, setFiltered] = useState<Program[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/programs`)
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data);
        setFiltered(data);
      })
      .catch(console.error);
  }, []);

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  const handleFilter = (category: string | null) => {
    setActiveCategory(category);
    if (category === null) {
      setFiltered(programs);
    } else {
      setFiltered(programs.filter((p) => p.category === category));
    }
    setOpenIndex(null);
  };

  const categories = Array.from(new Set(programs.map((p) => p.category)));

  return (
    <div className="space-y-4">
      {/* 🔘 Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeCategory === null ? "bg-green-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleFilter(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded ${
              activeCategory === cat ? "bg-green-700 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🔽 Accordion */}
      {filtered.map((program, index) => (
        <div key={program._id} className="border rounded-md bg-white shadow">
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center px-6 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              {/* Show image if available */}
              {program.image && (
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-10 h-10 rounded object-cover"
                />
              )}
              <span className="text-lg font-semibold text-[#1c2b21]">
                {program.title}
              </span>
            </div>
            <span className="text-gray-400">{openIndex === index ? "−" : "+"}</span>
          </button>
          {openIndex === index && (
            <ul className="px-8 pb-4 text-sm text-gray-700 list-disc list-inside space-y-1">
              {program.services.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}


