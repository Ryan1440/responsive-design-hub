import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTimeline } from '@/hooks/useTimeline';
import { useClients } from '@/hooks/useClients';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

const milestones = ['H-90', 'H-60', 'H-30', 'H-7', 'H-1', 'D-Day'];

const ClientTimeline = () => {
  const { user } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { tasks: allTasks, isLoading: tasksLoading } = useTimeline();

  // Get client's own data using user_id
  const myClient = clients.find(c => c.user_id === user?.id);
  
  // Filter tasks for this client
  const tasks = myClient ? allTasks.filter(t => t.client_id === myClient.id) : [];

  const getTasksByMilestone = (milestone: string) => {
    return tasks.filter((task) => task.milestone === milestone);
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
    };
    const labels: Record<string, string> = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      completed: 'Selesai',
    };
    return (
      <Badge variant="outline" className={styles[status || 'pending']}>
        {labels[status || 'pending']}
      </Badge>
    );
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (clientsLoading || tasksLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-32 w-full rounded-2xl mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!myClient) {
    return (
      <div className="p-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Timeline Persiapan</h1>
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Data tidak ditemukan</h3>
          <p className="text-muted-foreground">Akun Anda belum terhubung dengan data klien.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Timeline Persiapan</h1>
        <p className="text-muted-foreground">Pantau progres persiapan pernikahan Anda.</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-1">
              {myClient.name} & {myClient.partner}
            </h2>
            <p className="text-muted-foreground">
              Tanggal Acara:{' '}
              {new Date(myClient.event_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {completedCount}/{totalCount}
              </p>
              <p className="text-sm text-muted-foreground">Tugas Selesai</p>
            </div>
            <div className="w-20 h-20 relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${progress * 2.26} 226`}
                  className="text-accent"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

        <div className="space-y-8">
          {milestones.map((milestone, index) => {
            const milestoneTasks = getTasksByMilestone(milestone);
            const milestoneCompleted = milestoneTasks.length > 0 && milestoneTasks.every((t) => t.status === 'completed');
            const hasInProgress = milestoneTasks.some((t) => t.status === 'in-progress');

            return (
              <div key={milestone} className="relative">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0',
                      milestoneCompleted
                        ? 'bg-green-500 text-white'
                        : hasInProgress
                        ? 'bg-blue-500 text-white'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {milestoneCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : hasInProgress ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      <span className="font-bold text-sm">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      {milestone}
                      {milestone === 'D-Day' && ' 🎉'}
                    </h3>

                    {milestoneTasks.length > 0 ? (
                      <div className="space-y-3">
                        {milestoneTasks.map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              'bg-card rounded-xl p-4 border border-border shadow-soft',
                              task.status === 'completed' && 'bg-green-50/50'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              {getStatusIcon(task.status)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4
                                    className={cn(
                                      'font-semibold',
                                      task.status === 'completed'
                                        ? 'text-muted-foreground line-through'
                                        : 'text-foreground'
                                    )}
                                  >
                                    {task.title}
                                  </h4>
                                  {getStatusBadge(task.status)}
                                </div>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                )}
                                {task.due_date && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Due:{' '}
                                    {new Date(task.due_date).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-secondary/50 rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground">Belum ada tugas untuk milestone ini</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientTimeline;