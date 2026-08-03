import Link from "next/link";
import type { CSSProperties } from "react";

type ContentSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type PublicContentPageProps = {
  kicker?: string;
  title: string;
  intro: string;
  updatedAt: string;
  sections: ContentSection[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const pageCardStyle: CSSProperties = {
  width: "min(100%, 1080px)",
  maxWidth: 1080,
  placeItems: "stretch",
  textAlign: "start",
};

const headingStyle: CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gap: 12,
  textAlign: "center",
};

const introStyle: CSSProperties = {
  maxWidth: 820,
  margin: 0,
  color: "var(--we-v12-muted, #66758a)",
  fontSize: "clamp(.95rem, 1.3vw, 1.08rem)",
  lineHeight: 1.9,
};

const contentGridStyle: CSSProperties = {
  width: "100%",
  display: "grid",
  gap: 16,
  marginTop: 10,
};

const sectionStyle: CSSProperties = {
  width: "100%",
  padding: "clamp(18px, 3vw, 28px)",
  border: "1px solid var(--we-v12-line, #dce4ef)",
  borderRadius: 20,
  background: "var(--we-v12-surface, #ffffff)",
  boxShadow: "0 12px 34px rgba(15, 23, 42, 0.05)",
};

const paragraphStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "var(--we-v12-muted, #66758a)",
  lineHeight: 1.95,
};

const listStyle: CSSProperties = {
  margin: "12px 0 0",
  paddingInlineStart: 22,
  color: "var(--we-v12-muted, #66758a)",
  lineHeight: 1.95,
};

const actionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 12,
  marginTop: 8,
};

export function PublicContentPage({
  kicker = "WEB EMPIRE",
  title,
  intro,
  updatedAt,
  sections,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PublicContentPageProps) {
  return (
    <main className="we-page we-simple-page">
      <section className="we-container we-simple-card" style={pageCardStyle}>
        <header style={headingStyle}>
          <img
            src="/brand/v1.2/web-empire-logo-en-v1.2.png"
            alt="WEB EMPIRE"
            width="260"
            height="70"
          />
          <p className="we-simple-kicker">{kicker}</p>
          <h1>{title}</h1>
          <p style={introStyle}>{intro}</p>
          <small style={{ color: "var(--we-v12-muted, #66758a)" }}>{updatedAt}</small>
        </header>

        <article style={contentGridStyle}>
          {sections.map((section) => (
            <section key={section.title} style={sectionStyle}>
              <h2 style={{ margin: 0, fontSize: "clamp(1.08rem, 2vw, 1.35rem)" }}>
                {section.title}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} style={paragraphStyle}>
                  {paragraph}
                </p>
              ))}

              {section.items?.length ? (
                <ul style={listStyle}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>

        <div style={actionsStyle}>
          <Link href={primaryHref} className="we-button-primary">
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className="we-button-ghost">
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
