import { Music2, Heart, Users, Sparkles } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-text-light dark:text-white mb-6">
          About MoodMelody
        </h1>
        <p className="text-xl text-text-light dark:text-text-dark max-w-3xl mx-auto">
          We believe in the power of music to enhance our emotional well-being
          and create meaningful connections through shared experiences.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-text-light dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-text-light dark:text-text-dark mb-6 leading-relaxed">
            MoodMelody was created with a simple yet powerful mission: to help
            people express their emotions through music and connect with others
            who share similar experiences.
          </p>
          <p className="text-text-light dark:text-text-dark leading-relaxed">
            By combining advanced mood analysis with personalized music
            recommendations, we create a unique platform where emotional
            expression meets musical discovery.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-logo-glow-light dark:bg-logo-glow-dark rounded-3xl blur-xl" />
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: (
                    <Music2 className="h-8 w-8 text-primary-accent dark:text-primary-dim" />
                  ),
                  label: "Musical Expression",
                },
                {
                  icon: (
                    <Heart className="h-8 w-8 text-primary-accent dark:text-primary-dim" />
                  ),
                  label: "Emotional Growth",
                },
                {
                  icon: (
                    <Users className="h-8 w-8 text-text-primary-accent dark:text-primary-dim" />
                  ),
                  label: "Community Connection",
                },
                {
                  icon: (
                    <Sparkles className="h-8 w-8 text-primary-accent dark:text-primary-dim" />
                  ),
                  label: "Personal Discovery",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary-light dark:bg-primary-dark p-4 rounded-xl inline-block mb-3">
                    {item.icon}
                  </div>
                  <p className="font-medium text-text-light dark:text-white">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-text-light dark:text-white mb-12">
          Our Team
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: "Joyce Kuo",
              role: "Founder & CEO",
              bio: "Musician turned tech entrepreneur",
            },
            {
              name: "Zoe Lindqvist",
              role: "Lead Developer",
              bio: "Crafting digital experiences with code",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="w-24 h-24 bg-logo-text-light dark:bg-logo-text-dark rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-light dark:text-white mb-2">
                {member.name}
              </h3>
              <p className="text-primary-accent dark:text-primary font-medium mb-3">
                {member.role}
              </p>
              <p className="text-text-light dark:text-text-dark">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
