import { Link } from "react-router-dom";
import { Mail, HelpCircle, Scale } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Centering Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Contact */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary-accent dark:text-primary" />
              Contact
            </h3>
            <Link
              to="/contact"
              className="text-text-light dark:text-text-dark hover:text-primary-accent dark:hover:text-primary"
            >
              Contact Us
            </Link>
          </div>

          {/* Help */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-primary-accent dark:text-primary" />
              Help
            </h3>
            <Link
              to="/faq"
              className="block text-text-light dark:text-text-dark hover:text-primary-accent dark:hover:text-primary mb-2"
            >
              FAQ
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-primary-accent dark:text-primary" />
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light dark:text-text-dark hover:text-primary-accent dark:hover:text-primary"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light dark:text-text-dark hover:text-primary-accent dark:hover:text-primary"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
          <p className="text-center text-text-light dark:text-text-dark">
            © {new Date().getFullYear()} MoodMelody. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
