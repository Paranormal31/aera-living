export default function StartProject() {
  return (
    <section className="bg-[#faf9f7] py-32">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-neutral-900">
          Start Your Project
        </h2>

        <p className="mt-4 text-neutral-600">
          Tell us about your vision, and we&apos;ll bring it to life
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <form className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-full bg-neutral-100 px-5 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-full bg-neutral-100 px-5 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-full bg-neutral-100 px-5 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Home Design, Kitchen Remodel"
                  className="w-full rounded-full bg-neutral-100 px-5 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tell Us About Your Project
              </label>
              <textarea
                rows={4}
                placeholder="Share your vision, timeline, budget, and any specific requirements..."
                className="w-full rounded-2xl bg-neutral-100 px-5 py-4 outline-none focus:ring-2 focus:ring-neutral-300 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-full bg-neutral-900 text-white py-4 font-medium hover:bg-neutral-800 transition"
            >
              Submit Inquiry
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-10 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                ✉️
              </div>
              <div>
                <p className="text-neutral-500">Email</p>
                <p className="font-medium">design@aeraliving.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                📞
              </div>
              <div>
                <p className="text-neutral-500">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
