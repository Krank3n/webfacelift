import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — webfacelift",
  description: "Terms and conditions for using webfacelift.",
};

export default function TermsPage() {
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

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-12">
          Last updated: March 1, 2026
        </p>

        <div className="space-y-10 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using webfacelift (&quot;the Service&quot;), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. Description of Service
            </h2>
            <p>
              webfacelift is an AI-powered website reconstruction tool. You
              provide a website URL, and our Service scrapes the publicly
              available content, analyzes it using AI, and generates a modern
              redesign blueprint. You can iterate on the design via chat and
              export the results.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. User Accounts
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                You must sign in with a valid Google account to save projects
                and purchase credits.
              </li>
              <li>
                You are responsible for all activity that occurs under your
                account.
              </li>
              <li>
                You must not share your account credentials or allow others to
                access your account.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Credits and Payments
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Website reconstructions require credits. Credits can be
                purchased through our platform via Stripe.
              </li>
              <li>
                All purchases are final. Credits are non-refundable and
                non-transferable.
              </li>
              <li>
                Credits do not expire as long as your account remains active.
              </li>
              <li>
                Pricing is subject to change. Existing purchased credits will
                not be affected by price changes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Acceptable Use
            </h2>
            <p className="mb-3">You agree NOT to use the Service to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Reconstruct websites you do not own or have permission to
                redesign for commercial purposes without proper authorization.
              </li>
              <li>
                Scrape or reconstruct websites that contain illegal content.
              </li>
              <li>
                Attempt to reverse-engineer, decompile, or extract the
                underlying AI models or prompts.
              </li>
              <li>
                Use the Service to generate spam, phishing pages, or deceptive
                content.
              </li>
              <li>
                Abuse the platform through automated requests, bots, or
                excessive usage that degrades the service for others.
              </li>
              <li>
                Violate any applicable local, state, national, or international
                law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Intellectual Property
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white/90">Your content:</strong> You
                retain ownership of the content you upload and the projects you
                create. You grant us a limited license to process this content
                as needed to provide the Service.
              </li>
              <li>
                <strong className="text-white/90">Generated blueprints:</strong>{" "}
                Blueprints generated by the Service are yours to use. However,
                you are responsible for ensuring the content within them does
                not infringe on third-party rights.
              </li>
              <li>
                <strong className="text-white/90">Third-party content:</strong>{" "}
                When you submit a URL for reconstruction, you are responsible
                for having the right to use the content from that website.
                webfacelift is not responsible for copyright or intellectual
                property disputes arising from scraped content.
              </li>
              <li>
                <strong className="text-white/90">Our platform:</strong> The
                webfacelift platform, including its code, design, and AI
                prompts, is our intellectual property and may not be copied or
                reproduced.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Sharing and Collaboration
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                You can share projects via public links or invite collaborators
                with editor or viewer permissions.
              </li>
              <li>
                Public share links make your project viewable to anyone with the
                link. You are responsible for managing who has access.
              </li>
              <li>
                We are not responsible for how collaborators or link recipients
                use shared content.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Service Availability
            </h2>
            <p>
              We strive to keep the Service available at all times but do not
              guarantee uninterrupted access. The Service depends on third-party
              APIs (Anthropic, Google, Firecrawl) that may experience downtime
              or changes. We are not liable for service interruptions caused by
              third-party outages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              9. Limitation of Liability
            </h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of
              any kind. To the maximum extent permitted by law, webfacelift
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the Service,
              including but not limited to loss of data, revenue, or business
              opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              10. Termination
            </h2>
            <p>
              We may suspend or terminate your access to the Service at any
              time for violation of these terms. You may delete your account at
              any time. Upon termination, your projects and data will be
              deleted in accordance with our{" "}
              <Link
                href="/privacy"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              11. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the
              Service after changes constitutes acceptance of the new terms. We
              will notify you of significant changes by posting the update on
              this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              12. Contact
            </h2>
            <p>
              If you have questions about these terms, contact us at{" "}
              <a
                href="mailto:support@webfacelift.com"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                support@webfacelift.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
