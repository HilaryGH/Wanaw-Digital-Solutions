// src/components/DeliveryMap.tsx

const DeliveryMap = () => {
  return (
    <div className="w-full h-[450px] rounded-lg overflow-hidden shadow">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d126102.13000402067!2d38.70014808209121!3d9.000502444160198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2set!4v1753199967165!5m2!1sen!2set"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Wanaw Location"
      ></iframe>
    </div>
  );
};

export default DeliveryMap;
