export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Name and email address</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Profile information and preferences</li>
            <li>Template submissions and reviews</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process transactions and manage your account</li>
            <li>Send you transactional emails and updates</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information only:
          </p>
          <ul>
            <li>With service providers (e.g., Stripe for payments)</li>
            <li>When required by law</li>
            <li>To protect our rights and safety</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            We use cookies to enhance your experience, analyze usage, and assist in marketing efforts.
            You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through our support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
