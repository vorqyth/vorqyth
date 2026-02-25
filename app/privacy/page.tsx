import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Vorqenox",
  description:
    "Read the Vorqenox Privacy Policy to understand how we collect, use, and protect your information.",
}

const sections = [
  {
    title: "Information We Collect",
    content:
      "We may collect information you provide directly to us, including but not limited to your name, email address, and usage data when you interact with our platform. We also automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, and browsing patterns.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the information we collect to operate, maintain, and improve our services; to personalize your experience; to communicate with you about products, services, and updates; and to protect against fraudulent or unauthorized activity. We may also use aggregated, anonymized data for analytical purposes.",
  },
  {
    title: "Cookies and Tracking Technologies",
    content:
      "We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities. These technologies help us analyze trends, administer the website, track user movements, and gather demographic information. You can control cookie preferences through your browser settings.",
  },
  {
    title: "Third-Party Services",
    content:
      "Our platform may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We may also use third-party service providers to help us operate our business, who may have access to your information only to perform specific tasks on our behalf.",
  },
  {
    title: "Data Security",
    content:
      "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.",
  },
  {
    title: "Your Rights",
    content:
      "Depending on your location, you may have the right to access, correct, or delete your personal information; object to or restrict certain processing; and data portability. To exercise these rights, please contact us at Vorqenox@gmail.com.",
  },
  {
    title: "Children's Privacy",
    content:
      "Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with a revised effective date. Your continued use of our services after changes are posted constitutes your acceptance of the updated policy.",
  },
]

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              {"Last updated: "}{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="space-y-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              At Vorqenox, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website. Please read this policy
              carefully.
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
                {"If you have any questions about this Privacy Policy, please contact us at "}
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
