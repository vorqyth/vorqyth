import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Vorqenox",
  description:
    "Read the Vorqenox Terms of Service to understand the rules and regulations for using our platform.",
}

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing and using Vorqenox, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, you are not authorized to use or access this platform.",
  },
  {
    title: "Use License",
    content:
      "Permission is granted to temporarily access the materials on Vorqenox for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. You may not modify or copy the materials, use them for any commercial purpose, attempt to decompile or reverse engineer any software contained on the platform, or remove any copyright or proprietary notations.",
  },
  {
    title: "User Accounts",
    content:
      "When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of these Terms. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.",
  },
  {
    title: "Content and Conduct",
    content:
      "Our platform provides access to various digital content and tools. All content is provided for informational purposes only. You agree not to use the platform for any unlawful purpose, to harass or harm other users, to distribute malware or harmful code, or to infringe upon intellectual property rights.",
  },
  {
    title: "Intellectual Property",
    content:
      "The platform and its original content, features, and functionality are owned by Vorqenox and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Our trademarks may not be used in connection with any product or service without prior written consent.",
  },
  {
    title: "Third-Party Links",
    content:
      "Vorqenox may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services. You acknowledge and agree that we are not responsible for any damage or loss caused by your use of such content or services.",
  },
  {
    title: "Disclaimer",
    content:
      'The materials on Vorqenox are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim all warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that our services will be uninterrupted, secure, or error-free.',
  },
  {
    title: "Limitation of Liability",
    content:
      "In no event shall Vorqenox or its suppliers be liable for any damages arising out of the use or inability to use the materials on the platform, even if we have been notified of the possibility of such damage. Some jurisdictions do not allow limitations on implied warranties, so this limitation may not apply to you.",
  },
  {
    title: "Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes shall be resolved through binding arbitration in accordance with the rules of the relevant jurisdiction.",
  },
  {
    title: "Modifications",
    content:
      "We reserve the right to revise these Terms of Service at any time without notice. By continuing to use the platform after changes are made, you agree to be bound by the revised terms. It is your responsibility to review these terms periodically for updates.",
  },
]

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-10">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Legal
            </span>
            <h1 className="mb-3 text-3xl font-bold text-foreground">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              {"Last updated: "}{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="space-y-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Welcome to Vorqenox. These Terms of Service govern your use of our
              website and services. By using our platform, you agree to these
              terms in full. Please read them carefully before proceeding.
            </p>

            {sections.map((section, i) => (
              <div key={section.title}>
                <h2 className="mb-3 text-lg font-bold text-foreground">
                  <span className="text-primary">{i + 1}. </span>
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 text-sm font-bold text-foreground">
                Contact Us
              </h3>
              <p className="text-sm text-muted-foreground">
                {"If you have any questions about these Terms, please contact us at "}
                <a
                  href="mailto:Vorqenox@gmail.com"
                  className="text-primary hover:underline"
                >
                  Vorqenox@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
