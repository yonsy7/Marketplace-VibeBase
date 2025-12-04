export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using MarshalUI, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the templates for personal,
            non-commercial transitory viewing only. This is the grant of a license, not a transfer
            of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained in the templates</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2>3. Template Usage</h2>
          <p>
            Templates purchased or downloaded from MarshalUI may be used in personal and commercial
            projects. However, you may not resell, redistribute, or share the template files themselves.
          </p>
        </section>

        <section>
          <h2>4. Creator Responsibilities</h2>
          <p>
            Creators are responsible for ensuring their templates do not infringe on any third-party
            rights, including copyrights, trademarks, or patents.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall MarshalUI or its suppliers be liable for any damages arising out of
            the use or inability to use the templates.
          </p>
        </section>

        <section>
          <h2>6. Revisions</h2>
          <p>
            MarshalUI may revise these terms of service at any time without notice. By using this
            website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>
      </div>
    </div>
  );
}
