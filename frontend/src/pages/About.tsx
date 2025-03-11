/**
 * **About Page**
 *
 * Overview of the app’s purpose, mission, and team.
 *
 * **Features:**
 * - **Mission & Vision**: Explains the app’s goal of using music for emotional well-being.
 * - **Team Section**: Highlights key contributors.
 * - **Accessibility**:
 *   - `aria-labelledby` for better navigation.
 *   - `tabIndex={0}` for keyboard focusability.
 * - **Responsive UI**:
 *   - Tailwind CSS for layout and theming.
 *   - Dark mode support.
 */

import { Music2, Heart, Users, Sparkles } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-12">
      {/* Hero Section */}
      <div
        className="text-center mb-16"
        role="region" // Defines this as a meaningful section
        aria-labelledby="about-heading"
      >
        <h1 className="text-4xl font-bold text-text-light dark:text-white mb-6">
          About MoodMelody
        </h1>
        <p
          className="text-xl text-text-light dark:text-text-dark max-w-3xl mx-auto"
          aria-label="MoodMelody's purpose and mission"
          tabIndex={0} // Added to describe content meaningfully
        >
          We believe in the power of music to enhance our emotional well-being
          and create meaningful connections through shared experiences.
        </p>
      </div>

      {/* Mission Section */}
      <div
        className="grid md:grid-cols-2 gap-12 items-center mb-16"
        role="region" // Helps screen readers recognize this as an important section
        aria-labelledby="mission-heading"
        tabIndex={0} // Makes the whole section keyboard-focusable
      >
        <div>
          <h2
            id="mission-heading"
            className="text-3xl font-bold text-text-light dark:text-white mb-6"
          >
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
          {/* Decorative Glow (aria-hidden) */}
          <div
            className="absolute inset-0 bg-logo-glow-light dark:bg-logo-glow-dark rounded-3xl blur-xl"
            aria-hidden="true" // Hides non-essential decoration from screen readers
          />
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
                <div>
                  <div
                    className="bg-primary-light dark:bg-primary-dark p-4 rounded-xl inline-block mb-3"
                    aria-hidden="true" // Hides the decorative icon from assistive technology
                  >
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

      {/* Our Team Section */}
      <div
        className="text-center mb-16"
        role="region" // Added to define a meaningful section for screen readers
        aria-labelledby="about-heading" // Links to the heading for better navigation
      >
        <h2 className="text-3xl font-bold text-text-light dark:text-white mb-12">
          Our Team
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: "Joyce Kuo",
              role: "Software Engineer",
              bio: "Technigo Bootcamp graduate",
              // bio: "Musician turned tech entrepreneur",
              linkedin: "https://www.linkedin.com/in/joyce-kuo-dev/",
              github: "https://github.com/JoyceKuode",
              image: "/headshots/joyce-kuo.jpg",
            },
            {
              name: "Zoe Lindqvist",
              role: "Software Engineer",
              bio: "Technigo Bootcamp graduate",
              linkedin: "https://www.linkedin.com/in/zoe-lindqvist/",
              github: "https://github.com/zoe-lindqvist",
              image: "/headshots/zoe-lindqvist-2.jpg",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              role="article" // Marks this as an important content block
              tabIndex={0} // Allows keyboard users to focus on each team member card
              aria-labelledby={`team-member-${index}`} // Links to the person's name for better screen reader understanding
            >
              {/* <div className="w-24 h-24 bg-logo-text-light dark:bg-logo-text-dark rounded-full mx-auto mb-4" /> */}
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-text-light dark:text-white mb-2">
                {member.name}
              </h3>
              <p className="text-text-light dark:text-text-dark font-medium mb-3">
                {member.role}
              </p>

              <p className="text-text-light dark:text-text-dark">
                {member.bio}
              </p>

              <div className="flex items-center justify-center gap-4">
                {/* LinkedIn Profile Link */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${member.name}'s LinkedIn profile`}
                  className="mt-4 text-primary-accent dark:text-primary
                  transition-transform transform hover:scale-110 "
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>

                {/* GitHub */}
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-primary-accent dark:text-primary transition-transform transform hover:scale-110"
                  aria-label={`Visit ${member.name}'s GitHub profile`}
                >
                  <FaGithub className="w-6 h-6" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
