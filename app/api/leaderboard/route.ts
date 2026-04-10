import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || '';
  const recent = searchParams.get('recent') === 'true';
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

  const supabase = createAdminClient();

  if (recent) {
    // Return newest profiles for "Recent Builders" feed
    const { data } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url, role, company, gtmcommit_score, gtmcommit_tier, looking_for_work, created_at')
      .gt('gtmcommit_score', 0)
      .order('created_at', { ascending: false })
      .limit(limit);
    return NextResponse.json(data || []);
  }

  let query = supabase
    .from('profiles')
    .select('username, display_name, avatar_url, role, company, gtmcommit_score, gtmcommit_tier, looking_for_work')
    .gt('gtmcommit_score', 0)
    .order('gtmcommit_score', { ascending: false })
    .limit(limit);

  if (role) {
    query = query.eq('role', role);
  }

  const { data } = await query;

  return NextResponse.json(data || []);
}
