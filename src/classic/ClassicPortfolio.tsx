import { useEffect, useState } from 'react';
import {
  certifications,
  connect,
  education,
  experience,
  metrics,
  profile,
  projects,
  publicationNote,
  publications,
  skillGroups,
} from '../data/portfolio';
import { ViewModeToggle } from '../ViewModeToggle';

type ClassicPortfolioProps = {
  resumeHref: string;
  onToggleView: () => void;
};

type PageId = 'home' | 'experience' | 'projects' | 'resume' | 'beyond' | 'contact';

const pages: Array<{ id: PageId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience & Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
  { id: 'beyond', label: 'Beyond Engineering' },
  { id: 'contact', label: 'Contact' },
];

const pageIds = pages.map((page) => page.id);

function isPageId(value: string): value is PageId {
  return (pageIds as string[]).includes(value);
}

function readHashPage(): PageId {
  if (typeof window === 'undefined') {
    return 'home';
  }

  const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  return isPageId(raw) ? raw : 'home';
}

function isExternalHref(href: string) {
  return href.startsWith('http');
}

/**
 * Classic (recruiter-friendly) portfolio. Every value rendered here comes from
 * `src/data/portfolio.ts`, the same single source of truth the CLI reads.
 * Content is split across pages (hash-routed) to mirror the reference layout.
 * Buildlands (/game) is intentionally unreachable from this view.
 */
export function ClassicPortfolio({ resumeHref, onToggleView }: ClassicPortfolioProps) {
  const [page, setPage] = useState<PageId>(() => readHashPage());

  useEffect(() => {
    const syncFromHash = () => setPage(readHashPage());
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page]);

  const navigate = (nextPage: PageId) => {
    setPage(nextPage);
    if (typeof window !== 'undefined') {
      window.location.hash = `/${nextPage}`;
    }
  };

  return (
    <div className="classic-root">
      <div className="classic-canvas">
        <header className="classic-header">
          <div className="classic-header-content">
            <h1>{profile.name}</h1>
            <div className="classic-header-row">
              <nav aria-label="Classic portfolio pages">
                {pages.map((item) => (
                  <a
                    key={item.id}
                    href={`#/${item.id}`}
                    className={page === item.id ? 'active' : undefined}
                    aria-current={page === item.id ? 'page' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <ViewModeToggle viewMode="classic" onToggle={onToggleView} variant="button" />
            </div>
            <p className="classic-note classic-note-inline">
              Switch to <strong>CLI Mode</strong> above to explore the interactive terminal instead, if you like
              typing over scrolling.
            </p>
          </div>
        </header>

        <main className="classic-main">
          {page === 'home' ? <HomePage onNavigate={navigate} resumeHref={resumeHref} /> : null}
          {page === 'experience' ? <ExperiencePage /> : null}
          {page === 'projects' ? <ProjectsPage /> : null}
          {page === 'resume' ? <ResumePage resumeHref={resumeHref} /> : null}
          {page === 'beyond' ? <BeyondPage onToggleView={onToggleView} /> : null}
          {page === 'contact' ? <ContactPage resumeHref={resumeHref} /> : null}
        </main>

        <footer className="classic-footer">
          <div className="classic-footer-content">
            {connect.map((entry) => (
              <a
                className="classic-footer-link"
                key={entry.label}
                href={entry.href}
                target={isExternalHref(entry.href) ? '_blank' : undefined}
                rel={isExternalHref(entry.href) ? 'noreferrer' : undefined}
              >
                {entry.value}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

function PageIntro({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="classic-page-intro">
      <h2>{title}</h2>
      <p className="classic-meta">{subtitle}</p>
    </div>
  );
}

function HomePage({ onNavigate, resumeHref }: { onNavigate: (page: PageId) => void; resumeHref: string }) {
  return (
    <section className="classic-home">
      <h2 className="classic-hero-role">{profile.role}</h2>
      <p className="classic-hero-tagline">{profile.tagline}</p>
      <p className="classic-hero-meta">
        {profile.status} · {profile.location}
      </p>
      <div className="classic-cta-row">
        <a
          className="classic-button"
          href="#/projects"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('projects');
          }}
        >
          View Projects
        </a>
        <a className="classic-button" href={resumeHref} download="Piyush_Bhuyan_Resume.pdf">
          Download Resume
        </a>
        <a
          className="classic-button"
          href="#/contact"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('contact');
          }}
        >
          Get in Touch
        </a>
      </div>

      <div className="impact-strip" aria-label="Impact highlights">
        {metrics.map((metric) => (
          <div className="impact-tile" key={metric.label}>
            <span className="impact-label">{metric.label}</span>
            <strong className="impact-value">{metric.value}</strong>
            <p className="impact-detail">{metric.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Tabbed skills browser. Categories read as a vertical index on the left with a
 * count badge; the selected category's stack fills the panel on the right.
 * All content comes from `skillGroups` - nothing is duplicated or invented.
 */
function SkillsPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGroup = skillGroups[activeIndex];

  if (!activeGroup) {
    return null;
  }

  return (
    <div className="classic-skills">
      <div className="classic-skill-tabs" role="tablist" aria-label="Skill categories">
        {skillGroups.map((group, index) => (
          <button
            key={group.name}
            type="button"
            role="tab"
            id={`skill-tab-${index}`}
            aria-selected={index === activeIndex}
            aria-controls="skill-panel"
            className={`classic-skill-tab ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <span className="classic-skill-tab-name">{group.name}</span>
            <span className="classic-skill-tab-count">{group.items.length}</span>
          </button>
        ))}
      </div>

      <div
        className="classic-skill-panel"
        id="skill-panel"
        role="tabpanel"
        aria-labelledby={`skill-tab-${activeIndex}`}
      >
        <div className="classic-skill-panel-head">
          <span className="classic-skill-panel-index" aria-hidden="true">
            {String(activeIndex + 1).padStart(2, '0')} / {String(skillGroups.length).padStart(2, '0')}
          </span>
          <h4>{activeGroup.name}</h4>
        </div>
        <div className="classic-tech-stack">
          {activeGroup.items.map((item) => (
            <span className="classic-tech-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperiencePage() {
  return (
    <section>
      <PageIntro
        title="Experience &amp; Education"
        subtitle="Professional timeline and academic background."
      />
      <div className="classic-timeline">
        {experience.map((entry, index) => (
          <article
            key={`${entry.company}-${entry.role}-${entry.period}`}
            className={`classic-timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <span className="classic-timeline-dot" aria-hidden="true" />
            <div className="classic-timeline-content">
              <div className="classic-timeline-date">{entry.period}</div>
              <h3 className="classic-timeline-title">{entry.role}</h3>
              <div className="classic-timeline-company">
                {entry.company} · {entry.location}
              </div>
              <ul>
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        <article className="classic-timeline-item right">
          <span className="classic-timeline-dot" aria-hidden="true" />
          <div className="classic-timeline-content">
            <div className="classic-timeline-date">{education.period}</div>
            <h3 className="classic-timeline-title">{education.degree}</h3>
            <div className="classic-timeline-company">
              {education.institution} · {education.location}
            </div>
            <p className="classic-timeline-score">{education.score}</p>
            <ul>
              {education.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <div className="classic-subsection">
        <h3>Skills &amp; Expertise</h3>
        <SkillsPanel />
      </div>

      <div className="classic-subsection">
        <h3>Certifications</h3>
        <ul className="classic-cert-list">
          {certifications.map((certification) => (
            <li className="classic-cert" key={certification.name}>
              <span className="classic-cert-issuer">{certification.issuer}</span>
              <span className="classic-cert-name">{certification.name}</span>
              {certification.year ? (
                <span className="classic-cert-year">{certification.year}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectsPage() {
  return (
    <section>
      <PageIntro title="Selected Projects" subtitle="A couple of things I built because having free time was optional." />

      {projects.map((project) => (
        <article className="classic-project" key={project.name}>
          <div className="classic-project-head">
            <h3>
              {project.name} <span className="classic-project-year">({project.year})</span>
            </h3>
            <a className="classic-gh-link" href={project.href} target="_blank" rel="noreferrer">
              GitHub repo →
            </a>
          </div>
          <div className="classic-tech-stack">
            {project.stack.split(',').map((technology) => (
              <span className="classic-tech-chip" key={technology.trim()}>
                {technology.trim()}
              </span>
            ))}
          </div>
          <p>{project.summary}</p>
          <ul className="classic-highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      ))}

      <aside className="classic-callout">
        And ofc this portfolio website.
      </aside>

      <section className="classic-section-break" aria-labelledby="classic-research-heading">
        <h2 id="classic-research-heading">Research</h2>
        <p className="classic-meta">Peer-reviewed work and the systems behind it.</p>
        {publicationNote ? <p>{publicationNote}</p> : null}
        {publications.map((publication) => (
          <article className="classic-publication" key={publication.title}>
            <h3 className="classic-publication-title">{publication.title}</h3>
            <p className="classic-meta">
              {publication.venue} · {publication.year}
            </p>
            <p>{publication.summary}</p>
            <a href={publication.href} target="_blank" rel="noreferrer">
              DOI link →
            </a>
          </article>
        ))}
      </section>
    </section>
  );
}

function ResumePage({ resumeHref }: { resumeHref: string }) {
  return (
    <section>
      <PageIntro title="Resume" subtitle="Masked version, no phone number, no spam." />
      <p>
        Grab the Masked PDF below. The full version is one LinkedIn DM away.
      </p>
      <p className="classic-download-row">
        <a className="classic-button" href={resumeHref} download="Piyush_Bhuyan_Resume.pdf">
          Download Resume (PDF)
        </a>
      </p>
    </section>
  );
}

function BeyondPage({ onToggleView }: { onToggleView: () => void }) {
  const base = import.meta.env.BASE_URL;
  const hobbies = [
    {
      title: 'Lego',
      image: `${base}beyondengg/lego.jpeg`,
      caption:
        'I build things out of bricks the same way I build software: patiently, in layers, and slightly over-engineered.',
    },
    {
      title: 'Model United Nations',
      image: `${base}beyondengg/mun.jpeg`,
      caption:
        'Debating, negotiating, and holding a room together under pressure. Turns out the skill transfers directly to engineering.',
    },
    {
      title: 'Comics',
      image: `${base}beyondengg/comic.jpeg`,
      caption:
        'A long-running DC habit: the stories, the art, and the very specific hunt for the hard-to-find issues.',
    },
  ];

  return (
    <section>
      <PageIntro title="Beyond Engineering" subtitle="The human bits that shape how I work." />

      <div className="classic-subsection">
        <h3>Off the clock</h3>
        <div className="classic-hobbies">
          {hobbies.map((hobby) => (
            <figure className="classic-hobby" key={hobby.title}>
              <div className="classic-hobby-media">
                <img src={hobby.image} alt={hobby.title} loading="lazy" />
              </div>
              <figcaption>
                <h4>{hobby.title}</h4>
                <p>{hobby.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="classic-subsection">
        <h3>Honestly, the CLI is the better tour</h3>
        <p>
          The best way to discover me is through the CLI terminal. Switch to it, run the commands,
          and poke at things that are not listed. There is a game hidden in there with easter
          eggs worth finding.
        </p>
        <div className="classic-cta-row">
          <button type="button" className="classic-button" onClick={onToggleView}>
            Switch to the CLI
          </button>
        </div>
      </div>
    </section>
  );
}

function ContactPage({ resumeHref }: { resumeHref: string }) {
  return (
    <section>
      <PageIntro title="Contact" subtitle="The fastest ways to find me on the internet." />
      <div className="classic-contact-list">
        {connect.map((entry) => (
          <div className="classic-contact-link" key={entry.label}>
            <span className="classic-contact-label">{entry.label}</span>
            <a
              href={entry.href}
              target={isExternalHref(entry.href) ? '_blank' : undefined}
              rel={isExternalHref(entry.href) ? 'noreferrer' : undefined}
            >
              {entry.value}
            </a>
          </div>
        ))}
      </div>
      <p className="classic-resume-note">
        Prefer a PDF?{' '}
        <a href={resumeHref} download="Piyush_Bhuyan_Resume.pdf">
          Download the masked resume
        </a>
        . No phone number in this one; DM me on LinkedIn for the full version.
      </p>
    </section>
  );
}
