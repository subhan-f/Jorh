import { Link2, BarChart3, Fingerprint, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL ?? "http://localhost:4001";
const DOCS_URL = import.meta.env.VITE_DOCS_URL ?? "http://localhost:4002";

const features = [
  {
    icon: Zap,
    title: "Instant Shortening",
    description:
      "Create short, memorable links in seconds. No setup required — just paste your URL and go.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track every click with detailed analytics. See where your audience comes from and when they click.",
  },
  {
    icon: Fingerprint,
    title: "Custom Slugs",
    description:
      "Make your links truly yours. Choose custom slugs that reflect your brand or content.",
  },
];

const stats = [
  { value: "10k+", label: "Links Created" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 50ms", label: "Redirect Speed" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <Link2 className="h-5 w-5" />
            Jorh
          </a>
          <div className="flex items-center gap-3">
            <a
              href={`${DASHBOARD_URL}/login`}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign in
            </a>
            <a href={`${DASHBOARD_URL}/register`}>
              <Button size="sm">Get Started</Button>
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white pt-12 pb-16 sm:pt-20 sm:pb-28">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <Zap className="h-3.5 w-3.5" />
              Fast, reliable URL shortening
            </div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-7xl">
              Shorten.{" "}
              <span className="text-indigo-600">Share.</span>{" "}
              Track.
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-500 leading-relaxed">
              Jorh makes URL shortening effortless. Create clean, branded links
              in seconds and gain powerful insights into every click — all in
              one place.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={`${DASHBOARD_URL}/register`}>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="px-8">
                  View Docs
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-slate-100 bg-slate-50/50 py-14">
          <div className="mx-auto max-w-4xl px-6">
            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dt className="text-4xl font-extrabold text-indigo-600">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need
              </h2>
              <p className="mx-auto max-w-xl text-slate-500">
                Jorh gives you all the tools to create, manage and analyse your
                short links from a single, clean dashboard.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="pt-6">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                        <Icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-slate-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-indigo-600 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mb-8 text-indigo-200">
              Join thousands of users who trust Jorh for their link management.
              It's free to get started.
            </p>
            <a href={`${DASHBOARD_URL}/register`}>
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8"
              >
                Create Your First Link
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600"
          >
            <Link2 className="h-4 w-4" />
            Jorh
          </a>
          <p className="text-sm text-slate-400">Built with Jorh</p>
        </div>
      </footer>
    </div>
  );
}
