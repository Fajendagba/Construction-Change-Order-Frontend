export type UserRole = 'owner' | 'contractor' | 'architect'

export type ChangeOrderState =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface BudgetLineItem {
  cost_code: string
  description: string
  original_amount: number
  approved_changes: number
  current_amount: number
}

export interface Project {
  id: string
  name: string
  description: string | null
  original_budget: number
  approved_changes_total: number
  current_budget: number
  budget_line_items?: BudgetLineItem[]
  change_orders_count?: number
  created_at: string
  updated_at: string
}

export interface ChangeOrderUser {
  id: string
  name: string
}

export interface AuditLog {
  id: string
  action: string
  from_state: ChangeOrderState | null
  to_state: ChangeOrderState
  user: ChangeOrderUser
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface ChangeOrder {
  id: string
  number: number
  title: string
  description: string
  reason: string
  cost_code: string
  labor_cost: number
  material_cost: number
  total_cost: number
  state: ChangeOrderState
  submitted_by: ChangeOrderUser | null
  reviewed_by: ChangeOrderUser | null
  rejection_reason: string | null
  state_changed_at: string | null
  audit_logs?: AuditLog[]
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  data: T
}

export interface LoginResponse {
  user: User
  token: string
}

export interface CreateChangeOrderPayload {
  title: string
  description: string
  reason: string
  cost_code: string
  labor_cost: number
  material_cost: number
}

export interface TransitionPayload {
  target_state: ChangeOrderState
  rejection_reason?: string
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

export interface RealtimeChangeOrderEvent {
  change_order_id: string
  new_state: ChangeOrderState
  details: Record<string, unknown>
}
