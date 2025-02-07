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
        tabIndex={0} // Makes the whole section keyboard-focusabl
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

      {/* Team Section */}
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
              role: "Founder & CEO",
              bio: "Musician turned tech entrepreneur",
              linkedin: "https://www.linkedin.com/in/joyce-kuo-dev/",
              image: "/headshots/joyce-kuo.jpg",
            },
            {
              name: "Zoe Lindqvist",
              role: "Lead Developer",
              bio: "Crafting digital experiences with code",
              linkedin: "https://www.linkedin.com/in/zoe-lindqvist/",
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
              <p className="text-primary-accent dark:text-primary font-medium mb-3">
                {member.role}
              </p>

              <p className="text-text-light dark:text-text-dark">
                {member.bio}
              </p>

              {/* LinkedIn Profile Link */}
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center text-secondary-accent dark:text-secondary-400 hover:underline"
                aria-label={`Visit ${member.name}'s LinkedIn profile`}
              >
                <svg
                  className="w-5 h-5 mr-2 transition-transform transform hover:scale-110 hover:text-primary-accent dark:hover:text-primary duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.767s.784-1.767 1.75-1.767 1.75.79 1.75 1.767-.784 1.767-1.75 1.767zm13.5 11.268h-3v-5.4c0-1.285-.027-2.936-1.791-2.936-1.794 0-2.068 1.4-2.068 2.85v5.486h-3v-10h2.892v1.369h.041c.404-.765 1.391-1.573 2.864-1.573 3.064 0 3.646 2.015 3.646 4.634v5.57z" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
