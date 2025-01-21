import { HelpCircle } from "lucide-react";

export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How does mood analysis work?",
      answer:
        "Our AI analyzes the emotions expressed in your journal entries and matches them with music that complements or enhances your mood. The analysis takes into account the words you use, context, and overall sentiment.",
    },
    {
      question: "Can I share my entries privately?",
      answer:
        "Yes! You have full control over your entries. You can keep them private or share them with the community. Private entries are only visible to you.",
    },
    {
      question: "How are songs recommended?",
      answer:
        "Songs are recommended based on your mood analysis, music preferences, and our AI's understanding of music characteristics that match different emotional states.",
    },
    {
      question: "What data is shared publicly?",
      answer:
        "Only entries you choose to make public are shared with the community. Your private entries, personal information, and account details remain confidential.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <HelpCircle className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find answers to common questions about MoodMelody
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
