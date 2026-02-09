export default function CustomerReviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div className="max-w-3xl">
          <h1 className="font-['Cormorant'] text-5xl font-semibold text-foreground leading-tight">
            Customer Review
          </h1>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            We are refreshing the review experience. Browse a few recent
            highlights below and check back soon to share your story.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-medium text-foreground">
              Reviews Coming Soon
            </h2>

            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <p>
                We have paused new submissions while we rework this section.
              </p>
              <p>
                When it returns, you will be able to post your feedback and see
                it appear here.
              </p>
            </div>

            <form className="mt-6">
              <label className="block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                disabled
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm opacity-60"
              />

              <label className="mt-5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                disabled
                placeholder="you@example.com"
                type="email"
                className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm opacity-60"
              />

              <label className="mt-5 block text-sm font-medium text-foreground">
                Review
              </label>
              <textarea
                disabled
                placeholder="Share your experience..."
                rows={5}
                className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm opacity-60"
              />

              <button
                type="button"
                disabled
                className="mt-6 w-full rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-md opacity-60"
              >
                Posting Paused
              </button>
            </form>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-medium text-foreground">
                Featured Reviews
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Featured reviews are currently hidden while we refresh this
                section. Check back soon.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
