'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Shield className="w-8 h-8 text-truth-blue" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Privacy Policy
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            TRUTH believes privacy is a fundamental right.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-sm mt-3"
          >
            Last updated: March 14, 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-10">
          {/* Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              Information We Collect
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                TRUTH is designed with minimal data collection in mind. We collect only what is necessary to provide and improve our service:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong className="text-text-primary">Search queries:</strong> We temporarily process your search queries to generate AI-powered analysis results. Queries may be retained in anonymized, aggregated form to improve result quality.
                </li>
                <li>
                  <strong className="text-text-primary">No personal data stored:</strong> TRUTH does not require accounts, does not collect names, email addresses, or any personally identifiable information to use the service.
                </li>
                <li>
                  <strong className="text-text-primary">Technical data:</strong> Standard server logs (IP addresses, browser type, timestamps) may be collected for security and performance monitoring. These are automatically purged after 30 days.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* How We Use Information */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              How We Use Information
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>Information collected is used exclusively to:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Process and respond to your search queries with AI-generated analysis</li>
                <li>Improve the accuracy and relevance of TRUTH&apos;s discovery engine</li>
                <li>Monitor and protect the security of our infrastructure</li>
                <li>Generate anonymized usage statistics to guide product development</li>
              </ul>
              <p>
                We do not sell, rent, or share your information with third parties for marketing purposes. We do not build user profiles or track individuals across sessions.
              </p>
            </div>
          </motion.div>

          {/* Data Retention */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              Data Retention
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                Search queries are not permanently stored in association with any identifying information. Anonymized, aggregated query data may be retained to improve our AI models and source databases. Server logs are automatically deleted after 30 days.
              </p>
            </div>
          </motion.div>

          {/* Third-Party Services */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              Third-Party Services
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                TRUTH uses the following third-party services to provide its functionality:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong className="text-text-primary">OpenAI:</strong> Search queries are sent to OpenAI&apos;s API for AI-powered analysis. OpenAI&apos;s data usage policies apply to this processing. We do not send any personally identifiable information to OpenAI.
                </li>
                <li>
                  <strong className="text-text-primary">Hosting provider:</strong> Our infrastructure provider processes technical data as part of standard hosting operations.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              Your Rights
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>Since TRUTH collects minimal data and does not maintain user accounts, most traditional data rights (access, deletion, portability) are inherently satisfied. However, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Request information about what data, if any, we hold related to your usage</li>
                <li>Request deletion of any server logs associated with your IP address</li>
                <li>Opt out of any future analytics or tracking mechanisms we may implement</li>
                <li>Lodge a complaint with your local data protection authority</li>
              </ul>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              Contact
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                For any privacy-related questions or requests, please contact us at:
              </p>
              <p className="text-text-primary font-medium">
                privacy@truthengine.ai
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
