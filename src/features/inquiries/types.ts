export const INQUIRY_PROJECT_TYPES = ["예비 창업자", "초기 스타트업", "기업 신사업팀"] as const;

export type InquiryProjectType = (typeof INQUIRY_PROJECT_TYPES)[number];

export const INQUIRY_SOURCES = ["landing_modal", "landing_cta", "referral", "manual"] as const;

export type InquirySource = (typeof INQUIRY_SOURCES)[number];

export const INQUIRY_SOURCE_LABELS: Record<InquirySource, string> = {
  landing_modal: "랜딩 모달",
  landing_cta: "최종 CTA",
  referral: "소개",
  manual: "수동 등록",
};

export const INQUIRY_STATUSES = [
  "new",
  "reviewing",
  "qualified",
  "proposal_sent",
  "won",
  "archived",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "신규",
  reviewing: "검토 중",
  qualified: "상담 적합",
  proposal_sent: "제안 발송",
  won: "계약 완료",
  archived: "보류",
};

export const INQUIRY_PRIORITIES = ["high", "medium", "low"] as const;

export type InquiryPriority = (typeof INQUIRY_PRIORITIES)[number];

export const INQUIRY_PRIORITY_LABELS: Record<InquiryPriority, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

export type InquirySubmissionInput = {
  name: string;
  contact: string;
  projectType: InquiryProjectType;
  summary: string;
};

export type InquiryRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  contact: string;
  projectType: InquiryProjectType;
  summary: string;
  status: InquiryStatus;
  source: InquirySource;
  priority: InquiryPriority;
  owner: string | null;
  memo: string;
  nextAction: string;
  estimatedBudget: string | null;
  tags: string[];
  lastContactedAt: string | null;
};

export type InquiryAdminPatch = Pick<InquiryRecord, "status" | "owner" | "memo" | "nextAction">;

export type InquiryRepository = {
  listInquiries: () => Promise<InquiryRecord[]>;
  createInquiry: (input: InquirySubmissionInput) => Promise<{ id: string }>;
  updateInquiry: (id: string, patch: InquiryAdminPatch) => Promise<void>;
};
