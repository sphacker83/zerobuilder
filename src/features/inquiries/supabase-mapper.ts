import type {
  InquiryAdminPatch,
  InquiryPriority,
  InquiryProjectType,
  InquiryRecord,
  InquirySource,
  InquiryStatus,
  InquirySubmissionInput,
} from "@/features/inquiries/types";

export const INQUIRIES_TABLE_NAME = "inquiries";

export type InquiryRow = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  contact: string;
  project_type: InquiryProjectType;
  summary: string;
  status: InquiryStatus;
  source: InquirySource;
  priority: InquiryPriority;
  owner: string | null;
  memo: string | null;
  next_action: string | null;
  estimated_budget: string | null;
  tags: string[] | null;
  last_contacted_at: string | null;
};

export type InquiryInsertRow = {
  name: string;
  contact: string;
  project_type: InquiryProjectType;
  summary: string;
  source: InquirySource;
  status: InquiryStatus;
  priority: InquiryPriority;
};

export function mapInquiryRowToRecord(row: InquiryRow): InquiryRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    contact: row.contact,
    projectType: row.project_type,
    summary: row.summary,
    status: row.status,
    source: row.source,
    priority: row.priority,
    owner: row.owner,
    memo: row.memo ?? "",
    nextAction: row.next_action ?? "",
    estimatedBudget: row.estimated_budget,
    tags: row.tags ?? [],
    lastContactedAt: row.last_contacted_at,
  };
}

export function mapSubmissionInputToInsertRow(input: InquirySubmissionInput): InquiryInsertRow {
  return {
    name: input.name,
    contact: input.contact,
    project_type: input.projectType,
    summary: input.summary,
    source: "landing_modal",
    status: "new",
    priority: "medium",
  };
}

export function mapAdminPatchToUpdateRow(patch: InquiryAdminPatch) {
  return {
    status: patch.status,
    owner: patch.owner,
    memo: patch.memo,
    next_action: patch.nextAction,
    updated_at: new Date().toISOString(),
  };
}
