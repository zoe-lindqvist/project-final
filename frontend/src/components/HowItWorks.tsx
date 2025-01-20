import { BookOpen, Headphones, Users } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const features = [
    {
      icon: (
        <BookOpen className="h-8 w-8 text-primary-accent dark:text-primary" />
      ),
      title: "Express Your Feelings",
      description:
        "Write about your day and emotions in your personal journal space",
      gradient: "bg-logo-text-light dark:bg-logo-text-dark",
    },
    {
      icon: (
        <Headphones className="h-8 w-8 text-primary-accent dark:text-primary" />
      ),
      title: "Get Matched with Music",
      description:
        "Our AI analyzes your mood and finds the perfect songs to match",
      gradient: "bg-logo-glow-light dark:bg-logo-glow-dark",
    },
    {
      icon: <Users className="h-8 w-8 text-primary-accent dark:text-primary" />,
      title: "Connect & Share",
      description:
        "Join a community of music lovers and share your emotional journey",
      gradient: "bg-logo-icon-light dark:bg-logo-icon-dark",
    },
  ];

  return (
    <section className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          How It Works
        </h2>
        <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
          Transform your daily experiences into a personalized musical journey
          with our innovative platform
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <div key={index} className="relative group">
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 -z-10 ${feature.gradient}`}
            />
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary-light dark:bg-primary-dark/50 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-text-light dark:text-text-dark leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
