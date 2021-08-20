export class TimelineDetails {
  user_agent: string;
  ip: string;
  asn_org: string;
}

export class CycleTargetTimeline {
  time: Date;
  message: string;
  details: TimelineDetails;
}

export class CycleTarget {
  target_uuid: string;
  template_uuid: string;
  deception_level: string;
  send_date: Date;
  sent: boolean;
  sent_date: Date;
  error: string;
  timeline: CycleTargetTimeline[];
}

export class Cycle {
  cycle_uuid: string;
  subscription_uuid: string;
  template_uuids: string[];
  start_date: Date;
  end_date: Date;
  send_by_date: Date;
  active: boolean;
  target_count: number;
  targets: CycleTarget[];
  processing: boolean;

  // Helper Attributes
  nonhuman: boolean;
}

export class CycleStatsEventMetrics {
  count: number;
}

export class CycleStatsEvents {
  sent = new CycleStatsEventMetrics();
  opened = new CycleStatsEventMetrics();
  clicked = new CycleStatsEventMetrics();
}

export class CycleStatsLevel {
  high = new CycleStatsEvents();
  moderate = new CycleStatsEvents();
  low = new CycleStatsEvents();
  all = new CycleStatsEvents();
}

export class CycleStats {
  stats = new CycleStatsLevel();

  // old
  avg_time_to_first_click: string;
  avg_time_to_first_report: string;
  sent: number;
  campaign_details: any;
  aggregate_stats: any;
  template_breakdown: any;
  levels: any;
  asn_stats: any;
}
