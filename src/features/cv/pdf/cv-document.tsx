import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { formatDateRangeLocale } from "@/lib/dayjs/utils";
import { parseBoldParts } from "@/lib/render-bold";

import type { Education, Experience, Skill } from "@/features/cv/schema";

// `type` is a Prisma enum with different casing than the zod schema; omit it since the PDF doesn't use it
type PdfExperience = Omit<Experience, "type">;

type Props = {
  experiences: PdfExperience[];
  skills: Skill[];
  education: Education[];
  locale?: "en" | "fr";
  phone?: string;
};

const black = "#111827";
const muted = "#6b7280";
const accent = "#374151";
const blue = "#2E5C8A";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: black,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 46,
  },
  // ── Header ──────────────────────────────────────────────
  headerWrap: {
    flexDirection: "column",
    marginBottom: 10,
  },
  nameLine: {
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    letterSpacing: 0.5,
    color: black,
  },
  titleWrap: {
    alignItems: "center",
    marginBottom: 8,
  },
  titleLine: {
    fontSize: 12,
    color: blue,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    marginBottom: 3,
  },
  contactItem: {
    fontSize: 8.5,
    color: muted,
  },
  contactSep: {
    fontSize: 8.5,
    color: muted,
    marginHorizontal: 5,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  headerLink: {
    fontSize: 8.5,
    color: blue,
    textDecoration: "underline",
  },
  linkSep: {
    fontSize: 8.5,
    color: muted,
    marginHorizontal: 5,
  },
  // ── Section ──────────────────────────────────────────────
  section: { marginBottom: 10 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: blue,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: blue,
  },
  // ── Profile ──────────────────────────────────────────────
  profileText: {
    fontSize: 9.5,
    color: muted,
    lineHeight: 1.55,
  },
  // ── Experience ───────────────────────────────────────────
  expItem: { marginBottom: 10 },
  expTitleLine: {
    fontSize: 9,
    marginBottom: 2,
  },
  expPositionBold: {
    fontFamily: "Helvetica-Bold",
    color: black,
  },
  expCompanyText: {
    color: black,
  },
  expMeta: {
    fontSize: 8.5,
    color: muted,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  expDescription: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9.5,
    color: muted,
    lineHeight: 1.45,
    marginBottom: 3,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  bulletDot: {
    width: 11,
    fontSize: 9.5,
    color: muted,
    marginTop: 0.5,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: muted,
    lineHeight: 1.45,
  },
  stackRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  stackLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: accent,
  },
  stackValue: {
    fontSize: 8.5,
    color: muted,
  },
  // ── Skills ───────────────────────────────────────────────
  skillRow: {
    marginBottom: 3,
    lineHeight: 1.4,
  },
  skillCategoryLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: black,
  },
  skillCategoryValue: {
    fontSize: 9,
    color: muted,
  },
  // ── Education ────────────────────────────────────────────
  eduItem: { marginBottom: 3 },
  eduLine: {
    fontSize: 9.5,
    lineHeight: 1.4,
  },
  eduDegreeBold: {
    fontFamily: "Helvetica-Bold",
    color: black,
  },
  eduMeta: {
    color: muted,
  },
  // ── Languages ────────────────────────────────────────────
  langRow: {
    flexDirection: "row",
  },
  langBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: black,
  },
  langMuted: {
    fontSize: 9.5,
    color: muted,
  },
  langSep: {
    fontSize: 9.5,
    color: muted,
    marginHorizontal: 8,
  },
});

const PROFILE_EN =
  "Senior Frontend Engineer with 8 years of experience building production React, Next.js, and TypeScript applications. I've led frontend teams, shipped products used daily by thousands of users, and migrated legacy stacks toward modern architectures (App Router, Server Components). I care about code quality, accessibility (W3C certified), and the kind of small UX details that make a product feel right. Lately I've been exploring TanStack Start, Astro, and Svelte to stay close to where the ecosystem is heading.";

const PROFILE_FR =
  "Ingénieur frontend senior avec 8 ans d'expérience sur des applications React, Next.js et TypeScript en production. J'ai piloté des équipes frontend, livré des produits utilisés au quotidien par des milliers d'utilisateurs, et accompagné des migrations vers des architectures modernes (App Router, Server Components). Qualité du code, accessibilité (certifié W3C) et petits détails UX qui font qu'un produit se sent juste — voilà ce qui me tient à cœur.";

const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "Infra & DevOps",
  design: "Design",
  quality: "Quality & Testing",
  other: "Other",
};

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "quality",
  "devops",
  "design",
  "other",
];

function parseBold(text: string) {
  return parseBoldParts(text).map((part, i) =>
    i % 2 === 1 ? (
      <Text key={i} style={{ fontFamily: "Helvetica-Bold", color: black }}>
        {part}
      </Text>
    ) : (
      part
    ),
  );
}

export const CvDocument = ({
  experiences,
  skills,
  education,
  locale = "en",
  phone,
}: Props) => {
  const profile = locale === "fr" ? PROFILE_FR : PROFILE_EN;

  const skillsByCategory = CATEGORY_ORDER.reduce<Record<string, Skill[]>>(
    (acc, cat) => {
      const group = skills.filter((s) => s.technology.category === cat);
      if (group.length > 0) acc[cat] = group;
      return acc;
    },
    {},
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.headerWrap}>
          <View style={s.nameLine}>
            <Text style={s.name}>Guillaume Naimi</Text>
          </View>
          <View style={s.titleWrap}>
            <Text style={s.titleLine}>Senior Frontend Engineer</Text>
          </View>
          <View style={s.contactRow}>
            <Text style={s.contactItem}>naimi.guillaume@gmail.com</Text>
            {phone && <Text style={s.contactSep}>·</Text>}
            {phone && <Text style={s.contactItem}>{phone}</Text>}
            <Text style={s.contactSep}>·</Text>
            <Text style={s.contactItem}>Yerville (76)</Text>
            <Text style={s.contactSep}>·</Text>
            <Text style={s.contactItem}>
              {locale === "fr" ? "À distance / Rouen" : "Remote / Rouen"}
            </Text>
          </View>
          <View style={s.linksRow}>
            <Link src="https://guillaumenaimi.dev" style={s.headerLink}>
              guillaumenaimi.dev
            </Link>
            <Text style={s.linkSep}>·</Text>
            <Link
              src="https://www.linkedin.com/in/guillaume-naimi/"
              style={s.headerLink}
            >
              LinkedIn
            </Link>
            <Text style={s.linkSep}>·</Text>
            <Link src="https://github.com/guillaumeNaimi" style={s.headerLink}>
              GitHub
            </Link>
          </View>
        </View>

        {/* ── Profile ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            {locale === "fr" ? "Profil" : "Profile"}
          </Text>
          <Text style={s.profileText}>{profile}</Text>
        </View>

        {/* ── Experience ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            {locale === "fr"
              ? "Expérience Professionnelle"
              : "Professional Experience"}
          </Text>
          {experiences.map((exp) => (
            <View
              key={exp.company + exp.position}
              style={s.expItem}
              wrap={false}
            >
              <Text style={s.expTitleLine}>
                <Text style={s.expPositionBold}>{exp.position}</Text>
                <Text style={s.expCompanyText}> · {exp.company}</Text>
              </Text>
              <Text style={s.expMeta}>
                {exp.location ? `${exp.location} · ` : ""}
                {formatDateRangeLocale(exp.startDate, exp.endDate, locale)}
              </Text>
              {exp.description && (
                <Text style={s.expDescription}>{exp.description}</Text>
              )}
              {exp.achievements.map((a) => (
                <View key={a} style={s.bulletRow}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{parseBold(a)}</Text>
                </View>
              ))}
              {exp.technologies.length > 0 && (
                <View style={s.stackRow}>
                  <Text style={s.stackLabel}>Stack: </Text>
                  <Text style={s.stackValue}>
                    {exp.technologies.map((t) => t.name).join(", ")}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* ── Skills ── */}
        {Object.keys(skillsByCategory).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              {locale === "fr" ? "Compétences" : "Skills"}
            </Text>
            {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
              <Text key={cat} style={s.skillRow}>
                <Text style={s.skillCategoryLabel}>
                  {CATEGORY_LABELS[cat] ?? cat}
                </Text>
                <Text style={s.skillCategoryValue}>
                  {" — "}
                  {catSkills.map((s) => s.technology.name).join(", ")}
                </Text>
              </Text>
            ))}
          </View>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              {locale === "fr" ? "Formation" : "Education"}
            </Text>
            {education.map((edu) => (
              <View key={edu.institution + edu.degree} style={s.eduItem}>
                <Text style={s.eduLine}>
                  <Text style={s.eduDegreeBold}>
                    {edu.degree} ({edu.field})
                  </Text>
                  <Text style={s.eduMeta}>
                    {" — "}
                    {edu.institution}
                    {" · "}
                    {formatDateRangeLocale(edu.startDate, edu.endDate, locale)}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Languages ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            {locale === "fr" ? "Langues" : "Languages"}
          </Text>
          <View style={s.langRow}>
            <Text style={s.langBold}>
              {locale === "fr" ? "Français" : "French"}
            </Text>
            <Text style={s.langMuted}>
              {locale === "fr" ? " (natif)" : " (native)"}
            </Text>
            <Text style={s.langSep}>·</Text>
            <Text style={s.langBold}>
              {locale === "fr" ? "Anglais" : "English"}
            </Text>
            <Text style={s.langMuted}>
              {locale === "fr" ? " (professionnel)" : " (professional)"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
