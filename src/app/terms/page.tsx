'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-truth-blue" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Terms of Service
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            Information provided by TRUTH should be independently verified.
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
          {/* Acceptance */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              1. Acceptance of Terms
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                By accessing or using TRUTH (truthengine.ai), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of any changes.
              </p>
            </div>
          </motion.div>

          {/* Service Description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              2. Service Description
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                TRUTH is an AI-powered discovery engine that analyzes publicly available information across multiple domains including history, science, government records, archaeology, ocean research, cold cases, and public knowledge. The service uses artificial intelligence to surface connections, identify patterns, and provide analysis based on available sources.
              </p>
              <p>
                TRUTH operates through seven specialized &ldquo;lenses&rdquo; &mdash; each focusing on a specific domain of knowledge &mdash; as well as a general discovery engine that cross-references information across all domains.
              </p>
            </div>
          </motion.div>

          {/* Accuracy Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              3. Accuracy Disclaimer
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p className="bg-warning-amber/5 border border-warning-amber/20 rounded-lg p-4 text-text-primary">
                TRUTH provides analysis, not absolute truth. All information, analysis, confidence ratings, and connections presented by the service are AI-generated interpretations of available data. Results should be independently verified before being relied upon for any purpose.
              </p>
              <p>
                While we strive for accuracy and provide confidence levels with every result, AI analysis can contain errors, misinterpretations, or outdated information. TRUTH does not guarantee the completeness, accuracy, or timeliness of any information provided.
              </p>
              <p>
                Confidence levels (Verified, High, Moderate, Low, Unverified) indicate the AI&apos;s assessment of source reliability and corroboration &mdash; they are not guarantees of factual accuracy.
              </p>
            </div>
          </motion.div>

          {/* User Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              4. User Responsibilities
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>By using TRUTH, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to reverse-engineer, copy, or replicate the service&apos;s AI models or proprietary analysis methods</li>
                <li>Not use automated tools to scrape, harvest, or mass-download content from the service</li>
                <li>Not misrepresent TRUTH&apos;s AI-generated analysis as definitive factual reporting</li>
                <li>Independently verify any information obtained through the service before acting on it</li>
                <li>Not use the service to harass, defame, or cause harm to any individual or organization</li>
              </ul>
            </div>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              5. Intellectual Property
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                The TRUTH platform, including its design, AI models, analysis methodologies, user interface, and branding, is the intellectual property of TRUTH and its creators. The underlying factual information surfaced by TRUTH is derived from publicly available sources and is not claimed as proprietary.
              </p>
              <p>
                You may share and reference TRUTH&apos;s analysis results with proper attribution. You may not reproduce, distribute, or commercially exploit the service&apos;s interface, technology, or analysis systems without written permission.
              </p>
            </div>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              6. Limitation of Liability
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                TRUTH is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>TRUTH shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the service</li>
                <li>TRUTH does not warrant that the service will be uninterrupted, error-free, or free of harmful components</li>
                <li>TRUTH is not responsible for decisions made based on information provided by the service</li>
                <li>Total liability shall not exceed the amount you paid for the service (if any) in the 12 months preceding the claim</li>
              </ul>
            </div>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              7. Changes to Terms
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                We reserve the right to update these Terms of Service at any time. Changes will be effective immediately upon posting to the site. The &ldquo;Last updated&rdquo; date at the top of this page will reflect the most recent revision. Your continued use of TRUTH after changes are posted constitutes your acceptance of the modified terms.
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-3 border-b border-border pb-2">
              8. Contact
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-text-primary font-medium">
                legal@truthengine.ai
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
