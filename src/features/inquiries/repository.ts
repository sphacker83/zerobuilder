import { MOCK_INQUIRIES } from "@/features/inquiries/mock-data";
import type {
  InquiryAdminPatch,
  InquiryRecord,
  InquiryRepository,
  InquirySubmissionInput,
} from "@/features/inquiries/types";

function cloneInquiry(record: InquiryRecord): InquiryRecord {
  return {
    ...record,
    tags: [...record.tags],
  };
}

class MockInquiryRepository implements InquiryRepository {
  async listInquiries(): Promise<InquiryRecord[]> {
    return MOCK_INQUIRIES.map(cloneInquiry);
  }

  async createInquiry(input: InquirySubmissionInput): Promise<{ id: string }> {
    void input;
    return { id: `mock_${Date.now()}` };
  }

  async updateInquiry(id: string, patch: InquiryAdminPatch): Promise<void> {
    void id;
    void patch;
    return;
  }
}

const mockInquiryRepository = new MockInquiryRepository();

export function getInquiryRepository(): InquiryRepository {
  // TODO: Supabase client 연결 후 여기서 구현체를 분기합니다.
  return mockInquiryRepository;
}

export async function listAdminInquiries(): Promise<InquiryRecord[]> {
  return getInquiryRepository().listInquiries();
}
