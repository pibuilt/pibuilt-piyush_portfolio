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
  { id: 'experience', label: 'Experience' },
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
              Switch to <strong>CLI Mode</strong> above to explore the interactive terminal instead — if you like
              typing over scrolling.
            </p>
          </div>
        </header>

        <main className="classic-main">
          {page === 'home' ? <HomePage onNavigate={navigate} resumeHref={resumeHref} /> : null}
          {page === 'experience' ? <ExperiencePage /> : null}
          {page === 'projects' ? <ProjectsPage /> : null}
          {page === 'resume' ? <ResumePage resumeHref={resumeHref} /> : null}
          {page === 'beyond' ? <BeyondPage /> : null}
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
      <p className="classic-hero-role">{profile.role}</p>
      <p className="classic-hero-intro">{profile.intro}</p>
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

function ExperiencePage() {
  return (
    <section>
      <PageIntro title="Experience" subtitle="Professional timeline and the impact behind it." />
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
      </div>

      <div className="classic-subsection">
        <h3>Education</h3>
        <h4>{education.degree}</h4>
        <p className="classic-meta">
          {education.institution} · {education.location} · {education.period}
        </p>
        <p className="classic-meta">{education.score}</p>
        <ul>
          {education.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <div className="classic-subsection">
        <h3>Certifications</h3>
        <ul className="classic-cert-list">
          {certifications.map((certification) => (
            <li key={certification.name}>
              {certification.name}
              <span className="classic-meta">
                {' '}
                — {certification.issuer}
                {certification.year ? `, ${certification.year}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="classic-subsection">
        <h3>Research</h3>
        {publicationNote ? <p>{publicationNote}</p> : null}
        {publications.map((publication) => (
          <article className="classic-publication" key={publication.title}>
            <h4>{publication.title}</h4>
            <p className="classic-meta">
              {publication.venue} · {publication.year}
            </p>
            <p>{publication.summary}</p>
            <a href={publication.href} target="_blank" rel="noreferrer">
              DOI link →
            </a>
          </article>
        ))}
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
    </section>
  );
}

function ResumePage({ resumeHref }: { resumeHref: string }) {
  return (
    <section>
      <PageIntro title="Resume" subtitle="Condensed version — no phone number, no spam." />
      <p>
        Grab the condensed PDF below. The full version is one LinkedIn DM away.
      </p>
      <p className="classic-download-row">
        <a className="classic-button" href={resumeHref} download="Piyush_Bhuyan_Resume.pdf">
          Download Resume (PDF)
        </a>
      </p>

      <div className="classic-subsection">
        <h3>Skills &amp; Expertise</h3>
        <div className="classic-skills">
          {skillGroups.map((group) => (
            <div className="classic-skill-group" key={group.name}>
              <h4>{group.name}</h4>
              <div className="classic-tech-stack">
                {group.items.map((item) => (
                  <span className="classic-tech-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="classic-subsection">
        <h3>Education</h3>
        <h4>{education.degree}</h4>
        <p className="classic-meta">
          {education.institution} · {education.location} · {education.period}
        </p>
        <p className="classic-meta">{education.score}</p>
      </div>
    </section>
  );
}

function BeyondPage() {
  return (
    <section>
      <PageIntro title="Beyond Engineering" subtitle="The human bits that shape how I work." />
      <p>{profile.intro}</p>
      <h3>What I focus on</h3>
      <ul>
        {profile.focus.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
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
          Download the condensed resume
        </a>
        . No phone number in this one — DM me on LinkedIn for the full version.
      </p>
    </section>
  );
}
