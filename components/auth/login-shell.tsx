import Link from "next/link";

import { Brand } from "@/components/shared/brand";

export function LoginShell() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] items-center px-4 py-6">
      <div className="page-shell grid w-full overflow-hidden lg:grid-cols-[0.9fr,1.1fr]">
        <section className="brand-gradient relative overflow-hidden px-8 py-10 text-white md:px-12 md:py-14">
          <Brand dark subtitle="The Immutable Ledger" />
          <div className="mt-16 max-w-md">
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl">
              Secure. Verifiable. Yours.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/82">
              Access your secure credential dashboard or create a new institute workspace. Built for
              immutable issuance, blockchain proof, and learner-ready verification.
            </p>
          </div>
          <div className="mt-16 rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
              Trusted by training networks
            </p>
            <p className="mt-3 text-white/78">
              Issuing vocational, technical, and industry-aligned credentials with confidence.
            </p>
          </div>
          <div className="absolute -bottom-12 -right-10 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-2 right-12 h-28 w-28 rounded-[28px] border border-white/12 bg-white/10" />
        </section>

        <section className="bg-[linear-gradient(180deg,#fffdfd_0%,#f8f2ff_100%)] px-8 py-10 md:px-14 md:py-14">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B79B9]">
              Welcome to the Ledger
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#2A1659]">
              Sign in to the Portal
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#6E628C]">
              This demo uses a visual-only access form. The actual certificate flows live inside the
              local portal after you continue.
            </p>

            <div className="mt-8 grid grid-cols-2 rounded-2xl bg-violet-50 p-1 text-sm font-semibold text-[#5B2EE6]">
              <button type="button" className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                Login
              </button>
              <button type="button" className="rounded-2xl px-4 py-3 text-[#8B79B9]">
                Register
              </button>
            </div>

            <form className="mt-8 space-y-5">
              <label className="block space-y-2">
                <span className="text-sm text-[#6E628C]">Institution email</span>
                <input
                  type="email"
                  defaultValue="admin@ncvet.demo"
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-[#6E628C]">Identity key</span>
                <input
                  type="password"
                  defaultValue="credential-ledger"
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                />
              </label>
              <Link
                href="/portal"
                className="inline-flex w-full items-center justify-center rounded-2xl brand-gradient px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(91,46,230,0.25)]"
              >
                Sign In to Portal
              </Link>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[color:var(--line)] bg-white px-5 py-4 text-sm font-semibold text-[#4F26DA]"
              >
                Sign in with DigiLocker
              </button>
            </form>

            <div className="mt-8 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#8B79B9]">
              <span>Skill India</span>
              <span>NCVET</span>
              <span>Polygon</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
