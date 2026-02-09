"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const NAV_LINKS = [
  { href: "#problem", label: "문제", id: "problem" },
  { href: "#solution", label: "해결", id: "solution" },
  { href: "#process", label: "프로세스", id: "process" },
  { href: "#trust", label: "신뢰", id: "trust" },
  { href: "#final-cta", label: "문의", id: "final-cta" },
];

const PROBLEMS = [
  "개발비가 너무 비싸서 시작 자체가 어렵다.",
  "어떤 개발사를 믿어야 할지 판단이 어렵다.",
  "채용과 외주를 동시에 관리할 여력이 없다.",
  "아이디어는 있지만 실제 출시까지 연결되지 않는다.",
];

const PROCESS_STEPS = [
  "아이디어 접수 및 사업성 검토",
  "MVP 기획 및 제품 설계",
  "AI + 시니어 협업 개발 (4~8주)",
  "출시 및 운영 안정화",
  "수익 발생 후 성과 기반 정산",
];

const REVENUE_MODELS = [
  {
    title: "매출 로열티",
    detail: "프로젝트 성격에 따라 매출의 3~10%",
  },
  {
    title: "지분 참여",
    detail: "성장형 프로젝트에 5~30% 지분 연동",
  },
  {
    title: "성공 후 개발비 회수",
    detail: "수익 발생 이후 분할로 회수",
  },
  {
    title: "운영/유지보수",
    detail: "출시 후 안정화와 고도화 지원",
  },
];

const TRUST_METRICS = [
  { value: "20+", label: "시니어 경력 연차" },
  { value: "4~8주", label: "MVP 평균 출시 기간" },
  { value: "10~20%", label: "프로젝트 승인률" },
  { value: "0원", label: "초기 선금" },
];

const FIT_TARGETS = [
  "개발자 없이 아이디어를 제품으로 만들고 싶은 예비 창업자",
  "투자 전 단계에서 MVP 검증이 필요한 초기 스타트업",
  "빠른 실험과 출시가 필요한 기업 신사업팀",
];

const TIMELINE_STEPS = [
  {
    title: "아이디어 접수",
    deliverable: "핵심 문제/가설 정리 문서",
    gate: "창업자와 목표 정의 완료",
  },
  {
    title: "시장성 검토",
    deliverable: "타겟/수익 모델 검토 리포트",
    gate: "실행 가능성 심사 통과",
  },
  {
    title: "MVP 설계·개발",
    deliverable: "핵심 기능 중심 MVP",
    gate: "주간 리뷰 및 범위 합의",
  },
  {
    title: "출시·안정화",
    deliverable: "운영 대시보드/모니터링",
    gate: "런칭 체크리스트 완료",
  },
  {
    title: "성과 기반 정산",
    deliverable: "성과 지표 기반 정산표",
    gate: "장기 파트너십 전환",
  },
];

const ANON_CASES = [
  {
    name: "익명 B2B SaaS",
    duration: "6주 MVP",
    result: "초기 PoC에서 유료 전환 고객 3곳 확보",
  },
  {
    name: "익명 플랫폼 서비스",
    duration: "8주 출시",
    result: "내부 수작업 프로세스 40% 자동화",
  },
  {
    name: "익명 기업 신사업",
    duration: "7주 파일럿",
    result: "시장 반응 검증 후 본사업 예산 승인",
  },
];

type TiltState = {
  rotateX: number;
  rotateY: number;
};

type ContactForm = {
  name: string;
  contact: string;
  projectType: string;
  summary: string;
};

const INITIAL_FORM: ContactForm = {
  name: "",
  contact: "",
  projectType: "예비 창업자",
  summary: "",
};

export default function Home() {
  const [tilt, setTilt] = useState<TiltState>({ rotateX: -5, rotateY: 10 });
  const [activeStep, setActiveStep] = useState(0);
  const [timelinePaused, setTimelinePaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopButton, setShowTopButton] = useState(false);
  const [activeSection, setActiveSection] = useState("problem");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState<ContactForm>(INITIAL_FORM);

  const activeTimeline = useMemo(() => TIMELINE_STEPS[activeStep], [activeStep]);

  useEffect(() => {
    if (timelinePaused) return;
    const interval = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % TIMELINE_STEPS.length);
    }, 3600);
    return () => window.clearInterval(interval);
  }, [timelinePaused]);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const raw = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
      const clamped = Number(Math.min(1, Math.max(0, raw)).toFixed(4));
      setScrollProgress(clamped);
      setShowTopButton(clamped >= 0.2);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((item) => document.getElementById(item.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: [0.25, 0.4, 0.6, 0.75] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!revealTargets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeydown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeydown);
    };
  }, [isModalOpen]);

  const onTimelineMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-y * 8).toFixed(2)),
      rotateY: Number((x * 10).toFixed(2)),
    });
  };

  const onTimelineLeave = () => {
    setTimelinePaused(false);
    setTilt({ rotateX: -5, rotateY: 10 });
  };

  const openModal = () => {
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - scrollProgress);

  return (
    <>
      <main className="landing-root">
        <div className="landing-ambient" aria-hidden />
        <div className="landing-grid" aria-hidden />

        <header className="sticky top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between border-b border-transparent px-6 py-5 backdrop-blur-xl md:px-10">
          <Link href="#" className="font-display text-lg font-extrabold text-slate-900">
            Builder Studio
          </Link>
          <nav className="hidden items-center gap-2 text-sm text-slate-600 md:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  activeSection === item.id
                    ? "bg-cyan-100 text-cyan-900"
                    : "hover:bg-white/75 hover:text-slate-900"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button type="button" onClick={openModal} className="header-contact-btn">
            무료 상담
          </button>
        </header>

        <section
          data-reveal
          className="reveal-item mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-12 md:px-10 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
              Risk-sharing Builder Studio
            </p>
            <h1 className="mt-6 font-display text-4xl leading-tight font-extrabold text-slate-900 md:text-6xl">
              개발비 없이 시작하세요.
              <br />
              아이디어만 있으면,
              <br />
              <span className="text-cyan-700">서비스는 우리가 만듭니다.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              20년+ 경력 팀이 기획부터 출시까지 책임집니다. 우리는 외주가 아니라 리스크를
              함께 지는 파트너로 일합니다.
            </p>
            <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
              <div className="surface-chip">초기 개발비 0원</div>
              <div className="surface-chip">4~8주 MVP 출시</div>
              <div className="surface-chip">성과 기반 정산</div>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openModal} className="primary-btn">
                무료 아이디어 검토 받기
              </button>
              <a href="#process" className="secondary-btn">
                진행 방식 보기
              </a>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              “실패하면 개발비는 받지 않습니다.” “외주가 아니라 공동 파트너입니다.”
            </p>
          </div>

          <div className="relative">
            <div
              className="timeline-shell"
              onMouseMove={onTimelineMove}
              onMouseEnter={() => setTimelinePaused(true)}
              onMouseLeave={onTimelineLeave}
              style={{
                transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }}
            >
              <div className="timeline-shell-glow" aria-hidden />
              <div className="timeline-header">
                <p className="text-xs font-semibold tracking-[0.18em] text-cyan-700">EXECUTION ROADMAP</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
                  맡기면 어떻게 진행되는지
                  <br />
                  한눈에 보이도록 설계했습니다.
                </h3>
              </div>
              <div className="timeline-grid">
                {TIMELINE_STEPS.map((step, idx) => (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`timeline-step ${activeStep === idx ? "is-active" : ""}`}
                  >
                    <span className="timeline-step-index">{idx + 1}</span>
                    <span className="timeline-step-title">{step.title}</span>
                  </button>
                ))}
              </div>
              <div className="timeline-detail">
                <p className="text-sm font-semibold text-cyan-800">{activeTimeline.title}</p>
                <p className="mt-2 text-sm text-slate-600">산출물: {activeTimeline.deliverable}</p>
                <p className="mt-1 text-sm text-slate-600">승인 게이트: {activeTimeline.gate}</p>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-slate-500">
              단계 위에 마우스를 올리면 자동 재생이 멈추고 직접 확인할 수 있습니다.
            </p>
          </div>
        </section>

        <section id="problem" data-reveal className="reveal-item mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
          <p className="section-kicker">Problem</p>
          <h2 className="section-title">이런 고민 때문에 시작을 미루고 있나요?</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PROBLEMS.map((item, idx) => (
              <article key={item} className="surface-panel interactive-card">
                <p className="text-sm font-semibold text-cyan-700">0{idx + 1}</p>
                <p className="mt-2 text-slate-700">{item}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-lg font-semibold text-slate-800">
            좋은 아이디어의 대부분은 비용과 기술 장벽 때문에 시작도 못합니다.
          </p>
        </section>

        <section
          id="solution"
          data-reveal
          className="reveal-item mx-auto w-full max-w-6xl px-6 py-20 md:px-10"
        >
          <div className="grid gap-8 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.08)] backdrop-blur md:grid-cols-2">
            <div>
              <p className="section-kicker">Solution</p>
              <h2 className="section-title mt-2">그래서, 개발비를 받지 않습니다.</h2>
              <p className="mt-4 text-slate-600">
                우리는 단순 외주 회사가 아닙니다. 서비스가 성공해야 우리도 수익을 얻는 구조로
                함께 리스크를 부담합니다.
              </p>
              <ul className="mt-5 space-y-2 text-slate-700">
                <li>• 실패하면 개발비를 받지 않습니다.</li>
                <li>• 성공하면 함께 성장합니다.</li>
                <li>• AI 자동화 + 시니어 검수로 속도와 신뢰를 동시에 확보합니다.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-6">
              <p className="text-sm font-semibold text-cyan-800">Trust Framework</p>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li>요구사항 정의부터 기술 리스크를 선제 점검</li>
                <li>시니어 엔지니어 직접 설계/리뷰</li>
                <li>주간 공유와 승인 게이트 기반 일정 관리</li>
                <li>출시 후 운영 지표로 고도화 우선순위 결정</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="process"
          data-reveal
          className="reveal-item mx-auto w-full max-w-6xl px-6 py-20 md:px-10"
        >
          <p className="section-kicker">Process</p>
          <h2 className="section-title">아이디어에서 출시까지, 이렇게 진행됩니다.</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {PROCESS_STEPS.map((step, idx) => (
              <li key={step} className="surface-panel interactive-card min-h-36">
                <p className="font-display text-3xl font-bold text-cyan-700">{idx + 1}</p>
                <p className="mt-3 text-sm text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section data-reveal className="reveal-item mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
          <p className="section-kicker">Difference</p>
          <h2 className="section-title">일반 개발사와는 다릅니다.</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">일반 개발사</th>
                  <th className="px-4 py-3 font-semibold text-cyan-700">Builder Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-3">선금 필요</td>
                  <td className="px-4 py-3 font-semibold">초기 비용 0원</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">프로젝트 종료 후 관계 종료</td>
                  <td className="px-4 py-3 font-semibold">장기 파트너십</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">개발만 수행</td>
                  <td className="px-4 py-3 font-semibold">사업성 검토 + 운영 지원</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">주니어 중심 인력 투입</td>
                  <td className="px-4 py-3 font-semibold">20년+ 시니어 팀</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section data-reveal className="reveal-item mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="section-kicker">Revenue Model</p>
              <h2 className="section-title">비용이 아니라, 성과로 함께합니다.</h2>
              <p className="mt-4 text-slate-600">
                프로젝트 특성에 따라 아래 모델을 단독 또는 복합으로 적용합니다.
              </p>
              <div className="mt-6 grid gap-3">
                {REVENUE_MODELS.map((model) => (
                  <article key={model.title} className="surface-panel interactive-card">
                    <p className="font-semibold text-slate-800">{model.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{model.detail}</p>
                  </article>
                ))}
              </div>
            </div>
            <div id="trust" className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white">
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">TRUST METRICS</p>
              <h3 className="mt-3 font-display text-3xl font-bold">경력은 결과로 증명합니다.</h3>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {TRUST_METRICS.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
                  >
                    <p className="font-display text-2xl font-extrabold text-cyan-300">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-200">{item.label}</p>
                  </article>
                ))}
              </div>
              <p className="mt-8 text-sm text-slate-200">
                모든 프로젝트를 수주하지 않습니다. 시장성, 수익 모델, 실행 가능성을 기준으로
                선별된 프로젝트만 파트너로 진행합니다.
              </p>
            </div>
          </div>
        </section>

        <section data-reveal className="reveal-item mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
          <p className="section-kicker">Anonymous Cases</p>
          <h2 className="section-title">실무 현장에서 검증된 익명 사례</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ANON_CASES.map((item) => (
              <article key={item.name} className="surface-panel interactive-card">
                <p className="text-xs font-semibold tracking-wide text-cyan-700">익명 사례</p>
                <p className="mt-2 font-display text-xl font-bold text-slate-900">{item.name}</p>
                <p className="mt-2 text-sm text-slate-600">{item.duration}</p>
                <p className="mt-2 text-sm text-slate-700">{item.result}</p>
              </article>
            ))}
          </div>
        </section>

        <section data-reveal className="reveal-item mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
          <p className="section-kicker">Who It Fits</p>
          <h2 className="section-title">이런 팀에 가장 적합합니다.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {FIT_TARGETS.map((target) => (
              <article key={target} className="surface-panel interactive-card">
                <p className="text-slate-700">{target}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="final-cta"
          data-reveal
          className="reveal-item mx-auto w-full max-w-6xl px-6 pb-28 pt-20 md:px-10"
        >
          <div className="rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-600 to-blue-600 p-9 text-white shadow-[0_24px_60px_rgba(8,145,178,0.35)]">
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-100">FINAL CTA</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
              아이디어만 준비하세요.
              <br />
              나머지는 우리가 함께합니다.
            </h2>
            <p className="mt-4 max-w-2xl text-cyan-50">
              무료 사업성 검토 후 진행 여부를 안내드립니다. 개발비 때문에 시작을 미루지 마세요.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openModal} className="cta-main">
                무료 아이디어 제출하기
              </button>
              <button type="button" onClick={openModal} className="cta-sub">
                프로젝트 상담 신청
              </button>
            </div>
          </div>
        </section>
      </main>

      <button
        type="button"
        aria-label="맨 위로 이동"
        className={`top-progress-btn ${showTopButton ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg className="top-progress-ring" viewBox="0 0 44 44" aria-hidden>
          <circle cx="22" cy="22" r={ringRadius} className="top-ring-bg" />
          <circle
            cx="22"
            cy="22"
            r={ringRadius}
            className="top-ring-fg"
            style={{
              strokeDasharray: ringCircumference,
              strokeDashoffset: ringOffset,
            }}
          />
        </svg>
        <span className="top-progress-arrow">↑</span>
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal} role="presentation">
          <div className="modal-panel" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-cyan-700">CONTACT</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
                  프로젝트 상담 신청
                </h3>
              </div>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="닫기">
                ×
              </button>
            </div>

            {isSubmitted ? (
              <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                <p className="font-semibold text-cyan-900">접수가 완료되었습니다.</p>
                <p className="mt-2 text-sm text-slate-700">
                  입력해주신 내용을 기준으로 팀에서 검토 후 연락드리겠습니다.
                </p>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="form-field">
                  <span>이름</span>
                  <input
                    required
                    value={formState.name}
                    onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="홍길동"
                  />
                </label>
                <label className="form-field">
                  <span>연락처</span>
                  <input
                    required
                    value={formState.contact}
                    onChange={(event) => setFormState((prev) => ({ ...prev, contact: event.target.value }))}
                    placeholder="email 또는 전화번호"
                  />
                </label>
                <label className="form-field">
                  <span>프로젝트 유형</span>
                  <select
                    value={formState.projectType}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, projectType: event.target.value }))
                    }
                  >
                    <option>예비 창업자</option>
                    <option>초기 스타트업</option>
                    <option>기업 신사업팀</option>
                  </select>
                </label>
                <label className="form-field">
                  <span>프로젝트 한 줄 설명</span>
                  <textarea
                    required
                    rows={4}
                    value={formState.summary}
                    onChange={(event) => setFormState((prev) => ({ ...prev, summary: event.target.value }))}
                    placeholder="해결하려는 문제와 목표를 간단히 적어주세요."
                  />
                </label>
                <button type="submit" className="modal-submit">
                  상담 접수하기
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
