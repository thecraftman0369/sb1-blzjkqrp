export type ApiKeyStatus = 'active' | 'blocked' | 'revoked';
export type UsageStatus = 'allowed' | 'rate_limited' | 'blocked';
export type ViolationSeverity = 'warning' | 'critical';

export interface Plan {
  id: string;
  name: string;
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
  monthly_quota: number;
  created_at: string;
}

export interface ApiKey {
  id: string;
  key_value: string;
  owner_name: string;
  plan_id: string;
  status: ApiKeyStatus;
  override_multiplier: number | null;
  created_at: string;
}

export interface Endpoint {
  id: string;
  path: string;
  method: string;
  cost_multiplier: number;
  created_at: string;
}

export interface UsageLog {
  id: string;
  api_key_id: string;
  endpoint_id: string;
  status: UsageStatus;
  timestamp: string;
}

export interface Violation {
  id: string;
  api_key_id: string;
  endpoint_id: string;
  severity: ViolationSeverity;
  timestamp: string;
}

export interface Database {
  public: {
    Tables: {
      plans: { Row: Plan; Insert: Partial<Plan>; Update: Partial<Plan> };
      api_keys: { Row: ApiKey; Insert: Partial<ApiKey>; Update: Partial<ApiKey> };
      endpoints: { Row: Endpoint; Insert: Partial<Endpoint>; Update: Partial<Endpoint> };
      usage_log: { Row: UsageLog; Insert: Partial<UsageLog>; Update: Partial<UsageLog> };
      violations: { Row: Violation; Insert: Partial<Violation>; Update: Partial<Violation> };
    };
  };
}
