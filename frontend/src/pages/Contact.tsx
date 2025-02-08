/**
 * **Contact Page**
 *
 * Allows users to submit inquiries or feedback.
 *
 * **Features:**
 * - **Form Handling**: Captures name, email, and message with success confirmation.
 * - **Accessibility**:
 *   - `aria-live="polite"` for form updates.
 *   - `aria-required="true"` ensures required fields are recognized.
 *   - `role="alert"` announces success messages.
 * - **Responsive UI**:
 *   - Styled with Tailwind CSS, supporting dark mode.
 *   - Smooth transitions and form validation feedback.
 */

import { useState } from "react";
import { Send, Mail } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-12">
        <Mail className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              aria-required="true"
              aria-label="Enter your full name"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              aria-required="true"
              aria-label="Enter your email address"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            />
          </div>

          {/* Message Input */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Message
            </label>
            <TextareaAutosize
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              required
              aria-required="true"
              aria-label="Enter your message"
              minRows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            aria-disabled={showSuccess}
            className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
            <span>Send Message</span>
          </button>

          {/* Success Message */}
          {showSuccess && (
            <div
              role="alert"
              aroa-live="assrtive"
              className="text-green-600 dark:text-green-400 text-center"
            >
              Message sent successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
