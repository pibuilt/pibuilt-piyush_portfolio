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

type ClassicPortfolioProps = {
  resumeHref: string;
};

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

function scrollToSection(targetId: string) {
  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function isExternalHref(href: string) {
  return href.startsWith('http');
}

/**
 * Classic (recruiter-friendly) portfolio view. Every value rendered here comes
 * from `src/data/portfolio.ts`, the same single source of truth the CLI reads,
 * so the two modes can never drift apart. Buildlands (/game) is intentionally
 * unreachable from this view - it lives only in the CLI experience.
 */
export function ClassicPortfolio({ resumeHref }: ClassicPortfolioProps) {
  return (
    <div className="classic-root">
      <div className="classic-canvas">
        <header className="classic-header">
          <div className="classic-header-content">
            <h1>{profile.name}</h1>
            <nav aria-label="Page sections">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item.id);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <main>
          <section id="about" className="classic-hero">
            <p className="classic-hero-role">{profile.role}</p>
            <p className="classic-hero-intro">{profile.intro}</p>
            <p className="classic-hero-meta">
              {profile.status} · {profile.location}
            </p>
            <div className="classic-cta-row">
              <a
                className="classic-button"
                href="#projects"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection('projects');
                }}
              >
                View Projects
              </a>
              <a className="classic-button" href={resumeHref} download="Piyush_Bhuyan_Resume.pdf">
                Download Resume
              </a>
              <a
                className="classic-button"
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection('contact');
                }}
              >
                Get in Touch
              </a>
            </div>
          </section>

          <section className="impact-strip" aria-label="Impact highlights">
            {metrics.map((metric) => (
              <div className="impact-tile" key={metric.label}>
                <span className="impact-label">{metric.label}</span>
                <strong className="impact-value">{metric.value}</strong>
                <p className="impact-detail">{metric.detail}</p>
              </div>
            ))}
          </section>

          <section id="experience">
            <h2>Experience</h2>
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
          </section>

          <section id="projects">
            <h2>Featured Projects</h2>
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

          <section id="skills">
            <h2>Skills</h2>
            <div className="classic-skills">
              {skillGroups.map((group) => (
                <div className="classic-skill-group" key={group.name}>
                  <h3>{group.name}</h3>
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
          </section>

          <section id="education">
            <h2>Education &amp; Credentials</h2>

            <div className="classic-education">
              <h3>{education.degree}</h3>
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

          <section id="contact">
            <h2>Contact</h2>
            <p>The fastest ways to find me on the internet.</p>
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
