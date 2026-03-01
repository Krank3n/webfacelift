import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — webfacelift",
  description: "How webfacelift collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">
          Last updated: March 1, 2026
        </p>

        <div className="space-y-10 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              When you use webfacelift, we collect the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white/90">Account information:</strong>{" "}
                Your name, email address, and profile picture provided through
                Google OAuth when you sign in.
              </li>
              <li>
                <strong className="text-white/90">Website URLs:</strong> The
                URLs you submit for reconstruction, along with the scraped
                content (text, images, structure) from those sites.
              </li>
              <li>
                <strong className="text-white/90">Project data:</strong>{" "}
                Blueprints, chat messages, uploaded media, and other content you
                create within the platform.
              </li>
              <li>
                <strong className="text-white/90">Payment information:</strong>{" "}
                Payment details are processed directly by Stripe. We do not
                store your credit card numbers.
              </li>
              <li>
                <strong className="text-white/90">Usage data:</strong> Pages
                visited, features used, and interactions with the platform for
                analytics purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To provide and improve the website reconstruction service</li>
              <li>To process payments and manage your credit balance</li>
              <li>To enable project sharing and collaboration features</li>
              <li>To communicate with you about your account and service updates</li>
              <li>To analyze usage patterns and improve the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. Third-Party Services
            </h2>
            <p className="mb-3">
              We use the following third-party services to operate webfacelift.
              Each service processes certain data as described:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white/90">Anthropic (Claude):</strong>{" "}
                Website content is sent to Claude for analysis and blueprint
                generation. Subject to{" "}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Anthropic&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-white/90">Google (Gemini):</strong>{" "}
                Website content is processed by Gemini for design consultation.
                Subject to{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-white/90">Firecrawl:</strong> Used to
                scrape website content from URLs you provide. Subject to{" "}
                <a
                  href="https://www.firecrawl.dev/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Firecrawl&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-white/90">Supabase:</strong> Handles
                authentication, database storage, and file storage. Subject to{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Supabase&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-white/90">Stripe:</strong> Processes
                all payments securely. Subject to{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Stripe&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-white/90">Google Analytics:</strong>{" "}
                Collects anonymized usage data to help us improve the platform.
                Subject to{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Data Retention
            </h2>
            <p>
              Your project data is retained as long as your account is active.
              If you delete a project, its data is permanently removed from our
              systems. If you delete your account, all associated data is deleted
              within 30 days. Scraped website content used during generation is
              not stored beyond the generation process unless saved as part of a
              project.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard security measures including
              encrypted connections (HTTPS/TLS), secure authentication via
              OAuth 2.0, and PCI-compliant payment processing through Stripe.
              Your data is stored in Supabase&apos;s infrastructure with
              row-level security policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data and account</li>
              <li>Export your project data (via the JSON tab in the workspace)</li>
              <li>Withdraw consent for data processing at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:privacy@webfacelift.com"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                privacy@webfacelift.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Cookies
            </h2>
            <p>
              We use essential cookies for authentication and session management.
              We also use Google Analytics, which sets cookies to collect
              anonymized usage data. No advertising or tracking cookies are used
              beyond analytics.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of significant changes by posting the update on this
              page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              9. Contact
            </h2>
            <p>
              If you have questions about this privacy policy, contact us at{" "}
              <a
                href="mailto:privacy@webfacelift.com"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                privacy@webfacelift.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
