export const Community: React.FC = () => {
  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Songs Recommended" },
    { number: "100K+", label: "Moods Shared" },
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-3xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-16">
          Join Our Growing Community
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="p-8">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
