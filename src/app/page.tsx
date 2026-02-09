"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const NAV_LINKS = [
  { href: "#problem", label: "문제" },
  { href: "#solution", label: "해결 방식" },
  { href: "#process", label: "프로세스" },
  { href: "#trust", label: "신뢰 요소" },
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

type TiltState = {
  rotateX: number;
  rotateY: number;
};

export default function Home() {
  const [tilt, setTilt] = useState<TiltState>({ rotateX: -8, rotateY: 14 });
  const [confidence, setConfidence] = useState(84);

  const confidenceLabel = useMemo(() => {
    if (confidence >= 90) return "출시 확신 단계";
    if (confidence >= 80) return "검증 완료 단계";
    if (confidence >= 70) return "개선 진행 단계";
    return "검토 필요 단계";
  }, [confidence]);

  const onCoreMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-y * 20).toFixed(2)),
      rotateY: Number((x * 22).toFixed(2)),
    });
  };

  const onCoreLeave = () => {
    setTilt({ rotateX: -8, rotateY: 14 });
  };

  return (
    <main className="landing-root">
      <div className="landing-ambient" aria-hidden />
      <div className="landing-grid" aria-hidden />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <Link href="#" className="font-display text-lg font-extrabold text-slate-900">
          Builder Studio
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {NAV_LINKS.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#final-cta"
          className="rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-slate-300 hover:text-slate-900"
        >
          무료 상담
        </a>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-12 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
            AI + Senior Execution
          </p>
          <h1 className="mt-6 font-display text-4xl leading-tight font-extrabold text-slate-900 md:text-6xl">
            개발비 없이 시작하세요.
            <br />
            아이디어만 있으면,
            <br />
            <span className="text-cyan-700">서비스는 우리가 만듭니다.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            20년+ 경력의 전문가 팀이 기획, 디자인, 개발, 출시까지 책임집니다.
            초기 비용 0원으로 시작하고, 수익이 발생한 뒤 함께 정산합니다.
          </p>
          <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
            <div className="surface-chip">초기 개발비 0원</div>
            <div className="surface-chip">4~8주 MVP 출시</div>
            <div className="surface-chip">성과 기반 정산</div>
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#final-cta" className="primary-btn">
              무료 아이디어 검토 받기
            </a>
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
            className="core-shell"
            onMouseMove={onCoreMove}
            onMouseLeave={onCoreLeave}
            style={{
              transform: `perspective(1400px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            }}
          >
            <div className="core-gradient" aria-hidden />
            <div className="core-ring" aria-hidden />
            <div className="core-ring delay" aria-hidden />
            <div className="core-orb" aria-hidden />
            <div className="core-glow" aria-hidden />
            <div className="absolute right-6 top-6 rounded-full border border-white/60 bg-white/65 px-3 py-1 text-xs font-semibold text-slate-600 backdrop-blur">
              AI 평가 엔진
            </div>
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/70 bg-white/75 p-4 backdrop-blur">
              <p className="text-xs font-semibold tracking-wide text-slate-500">신뢰 지수 시뮬레이터</p>
              <p className="mt-1 text-2xl font-display font-extrabold text-slate-900">{confidence}%</p>
              <p className="text-xs text-slate-500">{confidenceLabel}</p>
              <input
                type="range"
                min={60}
                max={96}
                value={confidence}
                onChange={(event) => setConfidence(Number(event.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-600"
                aria-label="신뢰 지수"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            마우스를 움직여 3D 코어를 확인해보세요.
          </p>
        </div>
      </section>

      <section id="problem" className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <p className="section-kicker">Problem</p>
        <h2 className="section-title">이런 고민 때문에 시작을 미루고 있나요?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PROBLEMS.map((item, idx) => (
            <article key={item} className="surface-panel">
              <p className="text-sm font-semibold text-cyan-700">0{idx + 1}</p>
              <p className="mt-2 text-slate-700">{item}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-lg font-semibold text-slate-800">
          좋은 아이디어의 대부분은 비용과 기술 장벽 때문에 시작도 못합니다.
        </p>
      </section>

      <section id="solution" className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
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
              <li>AI 기반 요구사항 구조화 및 리스크 예측</li>
              <li>시니어 엔지니어 직접 설계/리뷰</li>
              <li>출시 이후 운영 지표 기반 고도화</li>
              <li>프로젝트 선별 심사로 품질 유지</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <p className="section-kicker">Process</p>
        <h2 className="section-title">아이디어에서 출시까지, 이렇게 진행됩니다.</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {PROCESS_STEPS.map((step, idx) => (
            <li key={step} className="surface-panel min-h-36">
              <p className="font-display text-3xl font-bold text-cyan-700">{idx + 1}</p>
              <p className="mt-3 text-sm text-slate-700">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
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

      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="section-kicker">Revenue Model</p>
            <h2 className="section-title">비용이 아니라, 성과로 함께합니다.</h2>
            <p className="mt-4 text-slate-600">
              프로젝트 특성에 따라 아래 모델을 단독 또는 복합으로 적용합니다.
            </p>
            <div className="mt-6 grid gap-3">
              {REVENUE_MODELS.map((model) => (
                <article key={model.title} className="surface-panel">
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
                  className="rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur"
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

      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <p className="section-kicker">Who It Fits</p>
        <h2 className="section-title">이런 팀에 가장 적합합니다.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {FIT_TARGETS.map((target) => (
            <article key={target} className="surface-panel">
              <p className="text-slate-700">{target}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="final-cta" className="mx-auto w-full max-w-6xl px-6 pb-28 pt-20 md:px-10">
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
            <a href="#" className="cta-main">
              무료 아이디어 제출하기
            </a>
            <a href="#" className="cta-sub">
              프로젝트 상담 신청
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
