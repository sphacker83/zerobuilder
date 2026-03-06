import type { Metadata } from "next";
import InquiriesAdminClient from "@/app/admin/inquiries/inquiries-admin-client";
import { listAdminInquiries } from "@/features/inquiries/repository";

export const metadata: Metadata = {
  title: "ZeroBuilder Admin | 문의 관리",
  description: "ZeroBuilder 문의사항을 관리하는 관리자 화면입니다.",
};

export default async function AdminInquiriesPage() {
  const inquiries = await listAdminInquiries();

  return <InquiriesAdminClient initialInquiries={inquiries} />;
}
