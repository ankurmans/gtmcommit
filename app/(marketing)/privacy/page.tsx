import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata = { title: 'Privacy Policy', description: 'Privacy Policy for GTM Commit, operated by KMF Ventures LLC.' };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-fg-secondary mt-2">Last updated: April 5, 2026</p>

          <div className="mt-8 space-y-6 text-fg-secondary leading-relaxed">
            <p>This Privacy Policy describes how <strong>KMF Ventures LLC</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and shares information in connection with <strong>GTM Commit</strong> (the &ldquo;Service&rdquo;), accessible at gtmcommit.com.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">1. Information We Collect</h2>

            <h3 className="font-display text-lg font-semibold text-fg-primary">a. Account Information</h3>
            <p>When you sign in via GitHub OAuth, we receive your GitHub username, display name, email address, and avatar URL. We do not collect passwords.</p>

            <h3 className="font-display text-lg font-semibold text-fg-primary">b. GitHub Data</h3>
            <p>With your authorization, we access your GitHub repositories (including private repositories if you grant the <code className="font-mono text-brand bg-brand-50 px-1.5 py-0.5 rounded">repo</code> scope) to analyze commit metadata. Specifically, we collect:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Commit SHA, timestamp, and diff statistics (additions, deletions, files changed)</li>
              <li>Commit message (first line only; redacted entirely for private repositories)</li>
              <li>AI tool detection results (e.g., Claude Code, Copilot, Cursor signatures)</li>
            </ul>
            <p><strong>We never store source code, file contents, or diffs.</strong> For private repositories, we never display the repository name or commit messages publicly — only aggregate statistics (e.g., &ldquo;47 AI commits across 3 private repos&rdquo;).</p>

            <h3 className="font-display text-lg font-semibold text-fg-primary">c. Profile Information</h3>
            <p>You may voluntarily provide additional information such as a bio, role, company, website URL, LinkedIn URL, Twitter handle, and portfolio items.</p>

            <h3 className="font-display text-lg font-semibold text-fg-primary">d. Usage Data</h3>
            <p>We use PostHog to collect anonymized product analytics, including page views, feature usage, and funnel events. This data is used to improve the Service and is not sold to third parties.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To create and maintain your GTM Commit profile</li>
              <li>To calculate your GTM Commit Score based on verified AI-assisted commits</li>
              <li>To display your public profile at gtmcommit.com/username</li>
              <li>To generate dynamic Open Graph images for social sharing</li>
              <li>To power the community leaderboard</li>
              <li>To send transactional emails (e.g., welcome messages, sync notifications)</li>
              <li>To improve and maintain the Service</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Service providers:</strong> Supabase (database and authentication), Vercel (hosting), PostHog (analytics), and Resend (email) — each bound by their own privacy policies</li>
              <li><strong>Public profile:</strong> Information you add to your profile (display name, bio, role, portfolio items, GTM Commit Score, and tool badges) is publicly visible by design</li>
              <li><strong>Legal requirements:</strong> If required by law, regulation, or legal process</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">4. GitHub Token Security</h2>
            <p>Your GitHub access token is encrypted at rest and is never exposed via any API endpoint. The token is used solely to sync commit metadata on your behalf. You can revoke access at any time from your GitHub settings.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">5. Data Retention &amp; Deletion</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You can disconnect GitHub at any time — all stored commit data is deleted immediately</li>
              <li>You can delete your account at any time — all profile data, commits, portfolio items, and vouches are permanently removed</li>
              <li>We retain anonymized, aggregated analytics data that cannot be linked back to you</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:contact@gtmcommit.com" className="text-brand underline">contact@gtmcommit.com</a>.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">7. Cookies</h2>
            <p>We use essential cookies for authentication and session management. PostHog may set analytics cookies. We do not use advertising or tracking cookies from third parties.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">8. Children&apos;s Privacy</h2>
            <p>The Service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">9. Transparency</h2>
            <p>We are committed to transparency about what data we collect and how it is processed. This privacy policy describes our practices in full. If you have questions, contact us at the email below.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by updating the &ldquo;Last updated&rdquo; date at the top of this page.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
            <p>
              <strong>KMF Ventures LLC</strong><br />
              Email: <a href="mailto:contact@gtmcommit.com" className="text-brand underline">contact@gtmcommit.com</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
