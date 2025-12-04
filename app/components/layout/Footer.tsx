import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Marshal<span className="text-primary">UI</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Premium AI-ready design templates for modern development.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Templates</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/templates" className="text-muted-foreground hover:text-foreground">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/templates?techStack=HTML" className="text-muted-foreground hover:text-foreground">
                  HTML Templates
                </Link>
              </li>
              <li>
                <Link href="/templates?techStack=REACT" className="text-muted-foreground hover:text-foreground">
                  React Templates
                </Link>
              </li>
              <li>
                <Link href="/templates?techStack=NEXTJS" className="text-muted-foreground hover:text-foreground">
                  Next.js Templates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Creators</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/creator/dashboard" className="text-muted-foreground hover:text-foreground">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/creator/templates/new" className="text-muted-foreground hover:text-foreground">
                  Submit Template
                </Link>
              </li>
              <li>
                <Link href="/creator/profile" className="text-muted-foreground hover:text-foreground">
                  Creator Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} MarshalUI. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Built with Next.js, Prisma, and Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}
