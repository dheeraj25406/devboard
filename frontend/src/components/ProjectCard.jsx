import { Link } from 'react-router-dom';

const statusColors = {
  planned: 'devboard-badge',
  building: 'devboard-badge text-[#d4d4d8]',
  completed: 'devboard-badge text-[#d4d4d8]',
};

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="devboard-card-interactive p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="devboard-heading text-lg font-semibold">{project.title}</h3>
        <span className={`shrink-0 ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm devboard-muted">
        {project.description || 'No description'}
      </p>
      {project.tech_stack_list?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {project.tech_stack_list.slice(0, 4).map((tech) => (
            <span key={tech} className="devboard-tag">{tech}</span>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center gap-4 text-xs devboard-dim">
        {project.primary_language && <span>{project.primary_language}</span>}
        {project.repo_stars > 0 && <span>★ {project.repo_stars}</span>}
        <span>{project.task_count ?? 0} tasks</span>
      </div>
    </Link>
  );
}
