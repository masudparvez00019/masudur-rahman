import {
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Facebook,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import type { IFooter } from "@/lib/models/footer";

interface FooterProps {
  footer?: Partial<IFooter>;
}

export default function Footer({ footer }: FooterProps) {
  // If no footer data is provided, use default values
  const companyName = footer?.companyName || "Masudur Rahman";
  const companyDescription =
    footer?.companyDescription ||
    "Web developer focused on creating beautiful and user-friendly web applications.";
  const sections = footer?.sections || [];
  const contactInfo = footer?.contactInfo || {
    email: "contact@masudurrahman.com",
    phone: "+880 1700 000000",
    address: "Dhaka, Bangladesh",
  };

  // Ensure socialLinks is not empty
  const socialLinks =
    footer?.socialLinks && Object.keys(footer?.socialLinks).length > 0
      ? footer.socialLinks
      : {
          github: "https://github.com",
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com",
          website: "https://masudurrahman.com",
        };

  const copyrightText =
    footer?.copyrightText?.replace(
      "{year}",
      new Date().getFullYear().toString()
    ) || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;

  // Helper function to render social icon
  const renderSocialIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case "github":
        return <Github className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "website":
        return <ExternalLink className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "messagecircle":
        return <MessageCircle className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      case "mail":
        return <Mail className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  return (
    <footer className="bg-background/50 backdrop-blur-md py-8 border-t border-border/40 relative z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-lg text-primary">
                {companyName}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {companyDescription}
            </p>
            <div className="flex gap-2 mt-4">
              {Object.entries(socialLinks).map(([key, url]) => (
                <Link
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                >
                  {renderSocialIcon(key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <div className="col-span-1" key={index}>
              <h3 className="font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.isExternal ? (
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <Link href={link.href} className="hover:text-primary">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{contactInfo.email}</li>
              <li>{contactInfo.phone}</li>
              <li>{contactInfo.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>{copyrightText}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
