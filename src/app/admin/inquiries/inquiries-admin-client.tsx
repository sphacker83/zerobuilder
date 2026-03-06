"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  INQUIRY_PRIORITY_LABELS,
  INQUIRY_PROJECT_TYPES,
  INQUIRY_SOURCE_LABELS,
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUSES,
  type InquiryAdminPatch,
  type InquiryProjectType,
  type InquiryRecord,
  type InquiryStatus,
} from "@/features/inquiries/types";

type InquiriesAdminClientProps = {
  initialInquiries: InquiryRecord[];
};

type EditorState = InquiryAdminPatch;

function formatDateTime(value: string | null) {
  if (!value) return "기록 없음";

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildEditorState(record: InquiryRecord | null): EditorState {
  if (!record) {
    return {
      status: "new",
      owner: null,
      memo: "",
      nextAction: "",
    };
  }

  return {
    status: record.status,
    owner: record.owner,
    memo: record.memo,
    nextAction: record.nextAction,
  };
}

const STATUS_BADGE_CLASS: Record<InquiryStatus, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  reviewing: "border-amber-200 bg-amber-50 text-amber-700",
  qualified: "border-violet-200 bg-violet-50 text-violet-700",
  proposal_sent: "border-indigo-200 bg-indigo-50 text-indigo-700",
  won: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

const PRIORITY_BADGE_CLASS = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  medium: "border-orange-200 bg-orange-50 text-orange-700",
  low: "border-slate-200 bg-slate-100 text-slate-600",
} as const;

export default function InquiriesAdminClient({ initialInquiries }: InquiriesAdminClientProps) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selectedId, setSelectedId] = useState<string | null>(initialInquiries[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [projectTypeFilter, setProjectTypeFilter] = useState<InquiryProjectType | "all">("all");
  const [editorState, setEditorState] = useState<EditorState>(() =>
    buildEditorState(initialInquiries[0] ?? null),
  );
  const [saveTick, setSaveTick] = useState<number | null>(null);

  const normalizedQuery = deferredSearch.trim().toLowerCase();

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((record) => {
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesProjectType =
        projectTypeFilter === "all" || record.projectType === projectTypeFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [record.name, record.contact, record.summary, record.nextAction, record.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesProjectType && matchesSearch;
    });
  }, [inquiries, normalizedQuery, projectTypeFilter, statusFilter]);

  useEffect(() => {
    if (filteredInquiries.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!filteredInquiries.some((record) => record.id === selectedId)) {
      setSelectedId(filteredInquiries[0].id);
    }
  }, [filteredInquiries, selectedId]);

  const selectedInquiry = useMemo(() => {
    if (filteredInquiries.length === 0) {
      return null;
    }

    if (!selectedId) {
      return filteredInquiries[0] ?? null;
    }

    return inquiries.find((record) => record.id === selectedId) ?? filteredInquiries[0] ?? null;
  }, [filteredInquiries, inquiries, selectedId]);

  useEffect(() => {
    setEditorState(buildEditorState(selectedInquiry));
  }, [selectedInquiry]);

  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      newCount: inquiries.filter((record) => record.status === "new").length,
      reviewingCount: inquiries.filter((record) => record.status === "reviewing").length,
      proposalCount: inquiries.filter((record) => record.status === "proposal_sent").length,
      wonCount: inquiries.filter((record) => record.status === "won").length,
    };
  }, [inquiries]);

  const handleSave = () => {
    if (!selectedInquiry) return;

    const now = new Date().toISOString();

    setInquiries((current) =>
      current.map((record) =>
        record.id === selectedInquiry.id
          ? {
              ...record,
              ...editorState,
              updatedAt: now,
              lastContactedAt: now,
            }
          : record,
      ),
    );
    setSaveTick(Date.now());
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.1),_transparent_24%),linear-gradient(180deg,_#eef2ff_0%,_#f8fafc_44%,_#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 md:px-10">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                ZeroBuilder
              </Link>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-indigo-700 uppercase">
                Admin
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-indigo-700 uppercase">
                Inquiry Console
              </p>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
                문의사항 관리
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                현재는 목업 저장소와 클라이언트 상태만 연결되어 있습니다. 새로고침 시 변경사항은
                초기화되며, 나중에는 <code>repository.ts</code> 와{" "}
                <code>supabase-mapper.ts</code> 기준으로 Supabase 구현체를 붙이면 됩니다.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-950 px-5 py-4 text-white shadow-[0_18px_48px_rgba(15,23,42,0.22)] md:min-w-[20rem]">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-300 uppercase">
                준비 상태
              </p>
              <p className="mt-2 text-lg font-bold">Supabase 연결 대기</p>
            </div>
            <div className="grid gap-2 text-sm text-slate-300">
              <p>1. 문의 타입과 테이블 매핑 코드 분리</p>
              <p>2. 관리자 목록/상세 화면 분리</p>
              <p>3. 추후 저장소 구현체만 교체 가능</p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">전체</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-950">{stats.total}</p>
            <p className="mt-2 text-sm text-slate-500">관리 대상 문의 수</p>
          </div>
          <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50/80 p-5 shadow-[0_20px_50px_rgba(37,99,235,0.08)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase">신규</p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">{stats.newCount}</p>
            <p className="mt-2 text-sm text-blue-700/80">아직 검토되지 않은 문의</p>
          </div>
          <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50/80 p-5 shadow-[0_20px_50px_rgba(217,119,6,0.08)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">검토 중</p>
            <p className="mt-3 text-3xl font-extrabold text-amber-950">{stats.reviewingCount}</p>
            <p className="mt-2 text-sm text-amber-700/80">다음 액션이 필요한 문의</p>
          </div>
          <div className="rounded-[1.5rem] border border-indigo-100 bg-indigo-50/80 p-5 shadow-[0_20px_50px_rgba(79,70,229,0.08)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-indigo-700 uppercase">제안 발송</p>
            <p className="mt-3 text-3xl font-extrabold text-indigo-950">{stats.proposalCount}</p>
            <p className="mt-2 text-sm text-indigo-700/80">제안서 전달 후 추적 중</p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-5 shadow-[0_20px_50px_rgba(5,150,105,0.08)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">계약 완료</p>
            <p className="mt-3 text-3xl font-extrabold text-emerald-950">{stats.wonCount}</p>
            <p className="mt-2 text-sm text-emerald-700/80">이미 진행 전환된 문의</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[1.8rem] border border-white/80 bg-white/82 p-5 shadow-[0_26px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">목록</p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-950">
                    문의 리스트
                  </h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                  검색 결과 {filteredInquiries.length}건
                </div>
              </div>

              <div className="grid gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50/90 p-4">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="이름, 연락처, 요약, 태그로 검색"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-0 transition focus:border-indigo-400"
                />
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setStatusFilter("all")}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                        statusFilter === "all"
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      전체
                    </button>
                    {INQUIRY_STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                          statusFilter === status
                            ? "bg-indigo-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {INQUIRY_STATUS_LABELS[status]}
                      </button>
                    ))}
                  </div>

                  <select
                    value={projectTypeFilter}
                    onChange={(event) =>
                      setProjectTypeFilter(event.target.value as InquiryProjectType | "all")
                    }
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400"
                  >
                    <option value="all">전체 유형</option>
                    {INQUIRY_PROJECT_TYPES.map((projectType) => (
                      <option key={projectType} value={projectType}>
                        {projectType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {filteredInquiries.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                  조건에 맞는 문의가 없습니다.
                </div>
              ) : (
                filteredInquiries.map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => setSelectedId(record.id)}
                    className={`rounded-[1.4rem] border p-4 text-left transition ${
                      selectedId === record.id
                        ? "border-indigo-300 bg-indigo-50/80 shadow-[0_18px_42px_rgba(79,70,229,0.12)]"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-bold text-slate-950">{record.name}</p>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                              STATUS_BADGE_CLASS[record.status]
                            }`}
                          >
                            {INQUIRY_STATUS_LABELS[record.status]}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                              PRIORITY_BADGE_CLASS[record.priority]
                            }`}
                          >
                            우선도 {INQUIRY_PRIORITY_LABELS[record.priority]}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-600">
                          {record.projectType} · {INQUIRY_SOURCE_LABELS[record.source]}
                        </p>
                      </div>
                      <p className="text-xs font-medium text-slate-400">
                        {formatDateTime(record.createdAt)}
                      </p>
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-700">
                      {record.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {record.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
            {!selectedInquiry ? (
              <div className="flex h-full min-h-[28rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 text-center text-sm text-slate-300">
                선택된 문의가 없습니다.
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-indigo-300 uppercase">
                        Inquiry Detail
                      </p>
                      <h2 className="mt-2 font-display text-3xl font-extrabold">
                        {selectedInquiry.name}
                      </h2>
                      <p className="mt-2 text-sm text-slate-300">{selectedInquiry.contact}</p>
                    </div>
                    <div className="grid gap-2 text-right text-xs text-slate-400">
                      <p>접수: {formatDateTime(selectedInquiry.createdAt)}</p>
                      <p>수정: {formatDateTime(selectedInquiry.updatedAt)}</p>
                      <p>마지막 응답: {formatDateTime(selectedInquiry.lastContactedAt)}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        유형
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {selectedInquiry.projectType}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        유입
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {INQUIRY_SOURCE_LABELS[selectedInquiry.source]}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        예산 힌트
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {selectedInquiry.estimatedBudget ?? "미정"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-slate-900/80 p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                      문의 내용
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-200">
                      {selectedInquiry.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedInquiry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-indigo-300 uppercase">
                        Action Panel
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white">상태 및 메모 관리</h3>
                    </div>
                    {saveTick ? (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        로컬 반영 완료
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-slate-200">상태</span>
                      <select
                        value={editorState.status}
                        onChange={(event) =>
                          setEditorState((current) => ({
                            ...current,
                            status: event.target.value as InquiryStatus,
                          }))
                        }
                        className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
                      >
                        {INQUIRY_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {INQUIRY_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-slate-200">담당자</span>
                      <input
                        value={editorState.owner ?? ""}
                        onChange={(event) =>
                          setEditorState((current) => ({
                            ...current,
                            owner: event.target.value.trim().length > 0 ? event.target.value : null,
                          }))
                        }
                        placeholder="예: Ethan"
                        className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-200">다음 액션</span>
                    <input
                      value={editorState.nextAction}
                      onChange={(event) =>
                        setEditorState((current) => ({
                          ...current,
                          nextAction: event.target.value,
                        }))
                      }
                      placeholder="예: 화상 미팅 일정 확정"
                      className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-200">관리 메모</span>
                    <textarea
                      rows={6}
                      value={editorState.memo}
                      onChange={(event) =>
                        setEditorState((current) => ({
                          ...current,
                          memo: event.target.value,
                        }))
                      }
                      placeholder="상담 준비 메모, 리스크, 후속 액션 등을 남겨두세요."
                      className="rounded-[1.3rem] border border-white/10 bg-slate-900/90 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-indigo-400"
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
                    >
                      로컬 상태에 반영
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorState(buildEditorState(selectedInquiry))}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      변경 취소
                    </button>
                  </div>

                  <div className="rounded-[1.3rem] border border-dashed border-white/12 bg-slate-900/80 px-4 py-4 text-sm leading-6 text-slate-300">
                    실제 저장은 아직 연결하지 않았습니다. 이후 Supabase 연결 시 이 패널의 저장 버튼은
                    `updateInquiry()` 호출로 바꾸면 됩니다.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
