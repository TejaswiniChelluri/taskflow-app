export function logActivity(type: string, message: string): void {
  const key = "taskflow_activity_log";
  let logs: any[] = [];
  const currentLogs = localStorage.getItem(key);

  if (currentLogs) {
    try {
      logs = JSON.parse(currentLogs);
    } catch (e) {
      logs = [];
    }
  }

  const newLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    message,
    timestamp: new Date().toISOString(),
  };

  logs.unshift(newLog);
  // Persist only the most recent 10 logs
  localStorage.setItem(key, JSON.stringify(logs.slice(0, 10)));
}
