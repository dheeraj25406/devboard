import Button from './Button';

const statusColors = {
  todo: 'devboard-dim',
  in_progress: 'devboard-secondary',
  done: 'devboard-secondary',
};

const priorityColors = {
  low: 'devboard-badge',
  medium: 'devboard-badge devboard-secondary',
  high: 'devboard-badge devboard-secondary',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="devboard-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="devboard-heading font-medium">{task.title}</h4>
          {task.description && (
            <p className="mt-1 text-sm devboard-muted">{task.description}</p>
          )}
        </div>
        <span className={`shrink-0 ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        <span className={`capitalize ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        {task.deadline && (
          <span className="devboard-dim">
            Due: {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="mt-3 flex gap-2">
          {onEdit && (
            <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => onEdit(task)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" className="!px-2 !py-1 text-xs" onClick={() => onDelete(task)}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
