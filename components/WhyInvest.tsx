import React from 'react';

const WhyInvest = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-10xl mx-auto px-4 lg:px-10">
        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="text-primary">•</span> Why To Invest In Gandhinagar?
          </h2>
        </div>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Video */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[340px]">
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/JjUfKt9zqVU?start=3"
              title="Why to invest in Gandhinagar?"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg w-full h-full"
            ></iframe>
          </div>
          {/* Right: Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Why You Should Invest in Gandhinagar
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Gandhinagar, the capital city of Gujarat, is rapidly emerging as a promising destination for smart investments. As the administrative heart of one of India's most industrially progressive states, it offers a stable political and economic environment that encourages long-term growth and development.
            </p>
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors w-fit">
              Read more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyInvest;
