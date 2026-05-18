import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata = { title: 'Terms of Service', description: 'Terms of Service for GTM Commit, operated by KMF Ventures LLC.' };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
          <p className="text-sm text-fg-secondary mt-2">Last updated: April 7, 2026</p>

          <div className="mt-8 space-y-6 text-fg-secondary leading-relaxed">
            <p>These Terms of Service (&ldquo;Terms&rdquo;) govern your use of <strong>GTM Commit</strong> (the &ldquo;Service&rdquo;), accessible at gtmcommit.com, operated by <strong>KMF Ventures LLC</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the Service, you agree to be bound by these Terms.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">1. Eligibility</h2>
            <p>You must be at least 13 years old to use the Service. By using the Service, you represent that you meet this requirement.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">2. Accounts</h2>
            <p>You sign in using GitHub OAuth. You are responsible for maintaining the security of your GitHub account. You agree not to share your account or allow others to access the Service through your credentials. You must notify us immediately of any unauthorized use.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">3. Use of the Service</h2>
            <p>You agree to use the Service only for lawful purposes. You may not:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Misrepresent your identity or affiliation</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Attempt to manipulate your GTM Commit Score through artificial means</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Scrape, crawl, or use automated means to access the Service without permission</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">4. GitHub Data</h2>
            <p>By connecting your GitHub account, you authorize us to access your repositories and commit metadata as described in our <a href="/privacy" className="text-brand underline">Privacy Policy</a>. We do not store source code or file contents. You may disconnect your GitHub account at any time, which will delete all stored commit data.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">5. User Content</h2>
            <p>You retain ownership of any content you submit to the Service (bio, portfolio items, project descriptions). By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to display that content as part of the Service, including on your public profile page and in social sharing previews (e.g., Open Graph images).</p>
            <p>You are solely responsible for the content you submit and represent that you have the right to share it.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">6. GTM Commit Score</h2>
            <p>Your GTM Commit Score is calculated algorithmically based on verified GitHub commits, portfolio items, peer vouches, and tool declarations. We reserve the right to modify the scoring algorithm at any time. The score is provided for informational purposes and does not constitute a certification, endorsement, or guarantee of skills or competence.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">7. Intellectual Property</h2>
            <p>The Service, including its design, code, branding, and content (excluding user-submitted content), is owned by KMF Ventures LLC and protected by applicable intellectual property laws. You may not copy, modify, distribute, or create derivative works from the Service without our prior written consent.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">8. Termination</h2>
            <p>We may suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. You may delete your account at any time through your account settings. Upon termination, all your data will be permanently deleted as described in our <a href="/privacy" className="text-brand underline">Privacy Policy</a>.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">9. Disclaimers</h2>
            <p>The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the Service will be uninterrupted, error-free, or secure.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, KMF Ventures LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount you have paid us in the 12 months preceding the claim, or $100, whichever is greater.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">11. Indemnification</h2>
            <p>You agree to indemnify and hold harmless KMF Ventures LLC from any claims, damages, losses, or expenses (including reasonable attorney&apos;s fees) arising from your use of the Service or violation of these Terms.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">12. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. We will notify you of material changes by updating the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">13. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles.</p>

            <h2 className="font-display text-2xl font-bold text-fg-primary pt-4">14. Contact Us</h2>
            <p>If you have questions about these Terms, contact us at:</p>
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
