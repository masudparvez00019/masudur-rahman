import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Masudur Rahman's Portfolio",
};

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-10 py-10 md:px-20 md:py-20 max-w-4xl mt-20 mb-10  border border-gray-200 rounded-lg shadow-md  dark:border-gray-900  backdrop dark:bg-black/20 bg-white/50">
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-80 background-image blur-md backdrop-blur"></div>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose prose-lg dark:prose-invert">
        <p className="mb-4">Last updated: May 14, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing and using this portfolio website, you accept and agree to
          be bound by the terms and provision of this agreement. If you do not
          agree to abide by these terms, please do not use this website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Website Use</h2>
        <p>
          This website is the professional portfolio of Masudur Rahman. You may
          view the website and its contents for your personal, non-commercial
          use subject to the restrictions set in these terms of service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          3. Intellectual Property Rights
        </h2>
        <p>
          All content on this website, including but not limited to text,
          graphics, logos, images, code samples, and software, is the property
          of Masudur Rahman and is protected by copyright laws.
        </p>
        <p className="mt-2">
          You may not reproduce, distribute, modify, create derivative works of,
          publicly display, publicly perform, republish, download, store, or
          transmit any of the material on the website without the prior written
          consent of Masudur Rahman.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Accounts</h2>
        <p>
          If you create an account on this website, you are responsible for
          maintaining the security of your account and are fully responsible for
          all activities that occur under the account.
        </p>
        <p className="mt-2">
          You must immediately notify Masudur Rahman of any unauthorized uses of
          your account or any other breaches of security.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Conduct</h2>
        <p>When using this website, you agree not to:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>
            Use the website in any way that violates any applicable local,
            state, national, or international law
          </li>
          <li>Attempt to interfere with the proper working of the website</li>
          <li>
            Engage in any conduct that restricts or inhibits anyone's use or
            enjoyment of the website
          </li>
          <li>Upload or transmit viruses or any other malicious code</li>
          <li>
            Attempt to gain unauthorized access to any portion of the website
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Disclaimer</h2>
        <p>
          This website and its content are provided "as is" without warranty of
          any kind, either express or implied, including but not limited to the
          implied warranties of merchantability, fitness for a particular
          purpose, or non-infringement.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          7. Limitation of Liability
        </h2>
        <p>
          In no event shall Masudur Rahman be liable for any direct, indirect,
          incidental, special, consequential or exemplary damages arising out of
          or in connection with your use of the website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          8. Changes to Terms
        </h2>
        <p>
          Masudur Rahman reserves the right to modify these terms at any time.
          We will always post the most current version on our website. By
          continuing to use the website after any changes, you agree to be bound
          by the revised terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          9. Contact Information
        </h2>
        <p>
          If you have any questions about these Terms, please contact Masudur
          Rahman through the contact form on this website.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
