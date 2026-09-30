import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Scissors, Share2, BarChart3, Zap, Lock, Clock, Smartphone, ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #5B4AEF 0%, transparent 40%), radial-gradient(circle at 80% 70%, #7C6FF2 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Short links. Clear insights.
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-ink-primary leading-tight max-w-3xl mx-auto mb-6">
            Create, share, and understand every link you share.
          </h1>

          <p className="text-lg text-ink-secondary max-w-2xl mx-auto mb-8">
            ShortMetric is a link management platform that gives you powerful
            analytics for every short link you create.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/create-link" className="btn btn-outline btn-lg">
                  Create a Link
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create your first link <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ink-primary mb-3">How it works</h2>
          <p className="text-ink-secondary max-w-xl mx-auto">
            Three simple steps to shorten, share, and track.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            number="01"
            icon={Scissors}
            title="Create"
            description="Shorten any URL and optionally add a custom alias."
          />
          <StepCard
            number="02"
            icon={Share2}
            title="Share"
            description="Copy the short link and share it anywhere — social, email, QR code."
          />
          <StepCard
            number="03"
            icon={BarChart3}
            title="Track"
            description="See clicks, devices, browsers, and referrers in real time."
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink-primary mb-3">
              Everything you need
            </h2>
            <p className="text-ink-secondary max-w-xl mx-auto">
              A focused set of features to manage links and understand performance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Short links"
              description="Generate clean, shareable short URLs instantly."
            />
            <FeatureCard
              icon={BarChart3}
              title="Click analytics"
              description="Track clicks over time, browsers, devices, and operating systems."
            />
            <FeatureCard
              icon={Lock}
              title="Private by default"
              description="Each user can only access their own links and analytics."
            />
            <FeatureCard
              icon={Clock}
              title="Expiration"
              description="Set links to expire automatically after a chosen date."
            />
            <FeatureCard
              icon={Smartphone}
              title="Responsive UI"
              description="Works cleanly on desktop, tablet, and mobile."
            />
            <FeatureCard
              icon={Scissors}
              title="Custom aliases"
              description="Choose memorable aliases instead of random codes."
            />
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-ink-primary mb-3">
            A dashboard built for clarity
          </h2>
          <p className="text-ink-secondary max-w-xl mx-auto">
            Clean metrics, fast filters, and a searchable list of all your links.
          </p>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="border-b border-border bg-surface-muted px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger/40" />
            <div className="w-3 h-3 rounded-full bg-warning/40" />
            <div className="w-3 h-3 rounded-full bg-success/40" />
          </div>
          <div className="p-6 grid md:grid-cols-4 gap-4">
            <PreviewMetric label="Total Links" value="24" />
            <PreviewMetric label="Total Clicks" value="3,481" />
            <PreviewMetric label="Active Links" value="20" />
            <PreviewMetric label="Expired" value="4" />
          </div>
          <div className="px-6 pb-6">
            <div className="rounded-md border border-border overflow-hidden">
              <div className="bg-surface-muted px-4 py-2 text-xs font-semibold uppercase text-ink-muted">
                Recent Links
              </div>
              <div className="p-4 space-y-3">
                <PreviewRow short="pycourse" clicks={1240} status="Active" />
                <PreviewRow short="launch" clicks={872} status="Active" />
                <PreviewRow short="promo23" clicks={514} status="Expired" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-ink-primary mb-3">
          Start tracking your links today
        </h2>
        <p className="text-ink-secondary mb-8">
          Free, no credit card, no setup — just create your first link.
        </p>
        {isAuthenticated ? (
          <Link to="/create-link" className="btn btn-primary btn-lg">
            Create a link <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </section>
    </div>
  );
}

// ---------- Sub-components ----------
function StepCard({ number, icon: Icon, title, description }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-xs font-bold text-primary">{number}</div>
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-ink-primary mb-1">{title}</h3>
      <p className="text-sm text-ink-secondary">{description}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="card p-6">
      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-ink-primary mb-1">{title}</h3>
      <p className="text-sm text-ink-secondary">{description}</p>
    </div>
  );
}

function PreviewMetric({ label, value }) {
  return (
    <div className="border border-border rounded-md p-4">
      <div className="text-xs font-semibold uppercase text-ink-muted mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold text-ink-primary">{value}</div>
    </div>
  );
}

function PreviewRow({ short, clicks, status }) {
  const variant =
    status === 'Active' ? 'badge-success' :
    status === 'Expired' ? 'badge-warning' :
    'badge-danger';
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-primary font-semibold text-sm">/{short}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-muted">{clicks} clicks</span>
        <span className={`badge ${variant}`}>{status}</span>
      </div>
    </div>
  );
}
