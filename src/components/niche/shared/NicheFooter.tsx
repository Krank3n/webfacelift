"use client";

interface NicheFooterProps {
  businessName: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  navLinks?: { label: string; href: string }[];
  socialLinks?: { platform: string; url: string }[];
  hours?: { day: string; hours: string }[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export default function NicheFooter({
  businessName,
  description,
  phone,
  email,
  address,
  navLinks,
  socialLinks,
  hours,
  colorScheme,
}: NicheFooterProps) {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
        borderColor: `${colorScheme.text}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">{businessName}</h3>
            {description && (
              <p className="mt-3 text-sm opacity-60 leading-relaxed">
                {description}
              </p>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    className="text-xs opacity-50 hover:opacity-100 transition-opacity capitalize"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          {navLinks && navLinks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-4 opacity-80">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4 opacity-80">
              Contact
            </h4>
            <ul className="space-y-2 text-sm opacity-60">
              {phone && <li>{phone}</li>}
              {email && <li>{email}</li>}
              {address && <li>{address}</li>}
            </ul>
          </div>

          {/* Hours */}
          {hours && hours.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-4 opacity-80">
                Hours
              </h4>
              <ul className="space-y-1.5 text-sm opacity-60">
                {hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span>{h.day}</span>
                    <span>{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className="mt-12 pt-6 border-t text-center text-xs opacity-40"
          style={{ borderColor: `${colorScheme.text}10` }}
        >
          &copy; {new Date().getFullYear()} {businessName}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
