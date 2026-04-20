import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Aera Living",
  description: "Privacy Policy and Terms of Service for Aera Living LLP.",
};

export default function TermsOfServicePage() {
  return (
    <section className="bg-[#f8f7f4] px-6 py-16 text-[#1f1f1c]">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Effective Date: March 29, 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 md:text-base">
          <section>
            <h2 className="font-serif text-2xl">1. Introduction</h2>
            <p className="mt-3">
              Welcome to Aera Living LLP ("Aera Living", "we", "our", "us").
            </p>
            <p className="mt-3">
              We are committed to protecting your privacy and ensuring that your
              personal information is handled securely and responsibly.
            </p>
            <p className="mt-3">
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your personal data when you:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Make bookings through platforms such as Airbnb</li>
              <li>
                Book directly via WhatsApp, phone, Instagram, or our website
              </li>
              <li>
                Visit our website:{" "}
                <a
                  href="https://www.aeraliving.co.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  https://www.aeraliving.co.in/
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl">2. Information We Collect</h2>
            <p className="mt-3">
              We collect only the information necessary to provide our services
              and comply with applicable laws.
            </p>
            <p className="mt-3 font-medium">a. Personal Information</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Email Address</li>
            </ul>
            <p className="mt-3 font-medium">b. Identity Verification Information</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Government-issued ID (such as Aadhaar Card, Passport, PAN Card,
                Driving License, etc.), as required by law
              </li>
            </ul>
            <p className="mt-3 font-medium">c. Payment Information</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Payment details processed via third-party platforms (such as
                Airbnb, UPI, or payment gateways)
              </li>
              <li>
                We do not store sensitive financial information such as card
                numbers or CVV details
              </li>
            </ul>
            <p className="mt-3 font-medium">d. Booking Information</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>
                Stay details (check-in/check-out dates, number of guests,
                preferences, etc.)
              </li>
            </ul>
            <p className="mt-3 font-medium">e. Website Data</p>
            <p className="mt-2">When you visit our website, we may collect:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Cookies and usage data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              3. How We Use Your Information
            </h2>
            <p className="mt-3">
              We use your information for the following purposes:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>To confirm, manage, and fulfill bookings</li>
              <li>
                To communicate with you before, during, and after your stay
              </li>
              <li>
                To verify guest identity as required under applicable laws
              </li>
              <li>To comply with legal and regulatory obligations</li>
              <li>To improve our services and customer experience</li>
              <li>
                To respond to inquiries, support requests, or complaints
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl">4. Legal Basis for Processing</h2>
            <p className="mt-3">We process your personal data based on:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Your consent (for direct bookings and communications)</li>
              <li>
                Legal obligations (such as guest verification requirements under
                Indian law)
              </li>
              <li>
                Legitimate business interests (such as service improvement and
                booking management)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl">5. Sharing of Information</h2>
            <p className="mt-3">We do not sell or rent your personal data.</p>
            <p className="mt-3">
              We may share your data only in the following circumstances:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                With booking platforms (e.g., Airbnb) when reservations are made
                through them
              </li>
              <li>
                With government authorities or law enforcement agencies where
                required by law
              </li>
              <li>
                With authorized personnel (such as caretakers or property
                managers) strictly for operational purposes
              </li>
            </ul>
            <p className="mt-3">All such sharing is limited to what is necessary.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">6. Data Retention</h2>
            <p className="mt-3">We retain personal data only for as long as necessary to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Fulfill the purposes outlined in this policy</li>
              <li>Comply with legal, tax, and regulatory requirements</li>
            </ul>
            <p className="mt-3">After this period, data is securely deleted or anonymized.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">7. Data Security</h2>
            <p className="mt-3">
              We implement reasonable technical and organizational safeguards to
              protect your personal data, including:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Restricted access to sensitive information</li>
              <li>Secure handling of identity documents</li>
              <li>Use of trusted third-party platforms for payments</li>
            </ul>
            <p className="mt-3">
              However, no method of transmission or storage is completely
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">8. Your Rights</h2>
            <p className="mt-3">Subject to applicable law, you have the right to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Access your personal data</li>
              <li>Request correction or updates</li>
              <li>
                Request deletion of your data (subject to legal obligations)
              </li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us using the details
              below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              9. WhatsApp &amp; Direct Communication Consent
            </h2>
            <p className="mt-3">
              By contacting or booking with Aera Living via WhatsApp, phone,
              Instagram, or similar channels, you consent to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Receiving transactional and service-related communications</li>
              <li>Being contacted for booking coordination and support</li>
            </ul>
            <p className="mt-3">
              We do not send promotional messages without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">10. Cookies &amp; Website Usage</h2>
            <p className="mt-3">
              Our website may use cookies and similar technologies to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Improve user experience</li>
              <li>Analyze website traffic</li>
              <li>Enhance service performance</li>
            </ul>
            <p className="mt-3">
              You may disable cookies through your browser settings, though some
              features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">11. Third-Party Links</h2>
            <p className="mt-3">
              Our website and communication channels may contain links to
              third-party platforms (such as Airbnb or Instagram). We are not
              responsible for the privacy practices of such external platforms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">12. Children's Privacy</h2>
            <p className="mt-3">
              Our services are not intended for individuals under the age of 18.
            </p>
            <p className="mt-3">
              We do not knowingly collect personal data from minors. If we
              become aware that such data has been collected, we will take
              appropriate steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">13. International Users</h2>
            <p className="mt-3">
              If you are accessing our services from outside India, please note
              that your data will be processed and stored in India.
            </p>
            <p className="mt-3">
              By using our services, you consent to the transfer of your
              information to India, which may have different data protection
              laws than your country of residence.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">14. Data Breach Notification</h2>
            <p className="mt-3">
              In the event of a data breach that may compromise your personal
              information, we will take appropriate steps to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Contain and assess the breach</li>
              <li>
                Notify relevant authorities, if required under applicable law
              </li>
              <li>
                Inform affected users where there is a significant risk of harm
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              15. Booking, Cancellation &amp; Refund Policies
            </h2>
            <p className="mt-3">
              Your booking, cancellation, and refund terms may be governed by:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Airbnb or third-party platform policies (if booked through
                them), or
              </li>
              <li>
                Aera Living's direct booking terms (if booked directly)
              </li>
            </ul>
            <p className="mt-3">
              We recommend reviewing the applicable cancellation and refund
              policy at the time of booking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">16. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. Updates will
              be posted on this page with a revised "Effective Date."
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl">17. Contact &amp; Grievance Officer</h2>
            <p className="mt-3">For any questions, concerns, or data-related requests, please contact:</p>
            <p className="mt-3">
              Aera Living LLP
              <br />
              House no-137, 3rd Floor, Flat no-7
              <br />
              Power &amp; Banking Society, Dehradun, Uttarakhand - 248007
            </p>
            <p className="mt-3">Email: aeraliving.llp@gmail.com</p>
            <p className="mt-3">Phone: +91 8544337974</p>
            <p className="mt-3">
              Grievance Officer:
              <br />
              Name: [Add Name Here]
              <br />
              Email: [Add Email Here]
            </p>
            <p className="mt-3">
              We will respond to grievances within a reasonable timeframe in
              accordance with applicable law.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
