'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import { resetBuckets } from '@/lib/rateLimiter';
import type { ApiKeyStatus } from '@/lib/types';

export async function createApiKey(formData: FormData) {
  const supabase = createServiceClient();
  const keyValue = `sk_live_${randomBytes(16).toString('hex')}`;

  await supabase.from('api_keys').insert({
    key_value: keyValue,
    owner_name: String(formData.get('owner_name')),
    plan_id: String(formData.get('plan_id')),
    status: 'active',
  });

  revalidatePath('/dashboard/keys');
  revalidatePath('/dashboard/simulator');
  revalidatePath('/dashboard');
}

export async function setApiKeyStatus(id: string, status: ApiKeyStatus) {
  const supabase = createServiceClient();
  await supabase.from('api_keys').update({ status }).eq('id', id);

  // Unblocking should feel like a clean slate, not "still rate limited
  // because the old buckets never refilled while the key sat blocked."
  if (status === 'active') {
    await resetBuckets(id);
  }

  revalidatePath('/dashboard/keys');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/metrics');
}

export async function updateOverrideMultiplier(id: string, multiplier: number | null) {
  const supabase = createServiceClient();
  await supabase
    .from('api_keys')
    .update({ override_multiplier: multiplier })
    .eq('id', id);

  revalidatePath('/dashboard/keys');
}

export async function createPlan(formData: FormData) {
  const supabase = createServiceClient();
  await supabase.from('plans').insert({
    name: String(formData.get('name')),
    requests_per_minute: Number(formData.get('requests_per_minute')),
    requests_per_hour: Number(formData.get('requests_per_hour')),
    requests_per_day: Number(formData.get('requests_per_day')),
    monthly_quota: Number(formData.get('monthly_quota')),
  });
  revalidatePath('/dashboard/plans');
}

export async function updatePlan(id: string, formData: FormData) {
  const supabase = createServiceClient();
  await supabase
    .from('plans')
    .update({
      name: String(formData.get('name')),
      requests_per_minute: Number(formData.get('requests_per_minute')),
      requests_per_hour: Number(formData.get('requests_per_hour')),
      requests_per_day: Number(formData.get('requests_per_day')),
      monthly_quota: Number(formData.get('monthly_quota')),
    })
    .eq('id', id);
  revalidatePath('/dashboard/plans');
  revalidatePath('/dashboard/keys');
}

export async function deletePlan(id: string) {
  const supabase = createServiceClient();
  await supabase.from('plans').delete().eq('id', id);
  revalidatePath('/dashboard/plans');
}

export async function createEndpoint(formData: FormData) {
  const supabase = createServiceClient();
  await supabase.from('endpoints').insert({
    path: String(formData.get('path')),
    method: String(formData.get('method')),
    cost_multiplier: Number(formData.get('cost_multiplier')),
  });
  revalidatePath('/dashboard/endpoints');
}

export async function updateEndpoint(id: string, formData: FormData) {
  const supabase = createServiceClient();
  await supabase
    .from('endpoints')
    .update({
      path: String(formData.get('path')),
      method: String(formData.get('method')),
      cost_multiplier: Number(formData.get('cost_multiplier')),
    })
    .eq('id', id);
  revalidatePath('/dashboard/endpoints');
}

export async function deleteEndpoint(id: string) {
  const supabase = createServiceClient();
  await supabase.from('endpoints').delete().eq('id', id);
  revalidatePath('/dashboard/endpoints');
}
