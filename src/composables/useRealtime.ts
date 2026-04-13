import echo from '../services/echo'
import type { RealtimeChangeOrderEvent } from '../types'

interface UseRealtime {
  subscribeToProject: (projectId: string, callback: (event: RealtimeChangeOrderEvent) => void) => void
  unsubscribeFromProject: (projectId: string) => void
}

export function useRealtime(): UseRealtime {
  function subscribeToProject(
    projectId: string,
    callback: (event: RealtimeChangeOrderEvent) => void,
  ): void {
    echo.channel(`project.${projectId}`).listen('.change-order.updated', callback)
  }

  function unsubscribeFromProject(projectId: string): void {
    echo.leaveChannel(`project.${projectId}`)
  }

  return {
    subscribeToProject,
    unsubscribeFromProject,
  }
}
