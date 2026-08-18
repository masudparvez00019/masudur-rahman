import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Masudur Rahman's Portfolio",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-10 py-10 md:px-20 md:py-20 max-w-4xl mt-20 mb-10  border border-gray-200 rounded-lg shadow-md  dark:border-gray-900  backdrop dark:bg-black/20 bg-white/50">
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-80 background-image blur-md backdrop-blur"></div>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose prose-lg dark:prose-invert">
        <p className="mb-4">Last updated: May 14, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p>
          Welcome to Masudur Rahman&apos;s portfolio website. I respect your
          privacy and am committed to protecting your personal data. This
          Privacy Policy will inform you about how I look after your personal
          data when you visit my website and tell you about your privacy rights
          and how the law protects you.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">The Data I Collect</h2>
        <p>When you visit my portfolio website, I may collect:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>
            Personal data you provide through contact forms (name, email
            address, message content)
          </li>
          <li>Account data if you create an account (email, name, password)</li>
          <li>
            Technical data including IP address, browser type and version, time
            zone and location, device information
          </li>
          <li>Usage data about how you use the website</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          How I Use Your Data
        </h2>
        <p>I use your data to:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>Respond to your inquiries and messages</li>
          <li>Provide and maintain your account if you create one</li>
          <li>Improve my website and services</li>
          <li>Send updates about my work (only with your consent)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
        <p>
          My website uses cookies to enhance your browsing experience. These
          include:
        </p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>Essential cookies for website functionality</li>
          <li>
            Analytics cookies to understand how visitors interact with the
            website
          </li>
          <li>Authentication cookies if you create an account</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p>
          I have implemented appropriate security measures to prevent your
          personal data from being accidentally lost, used, or accessed in an
          unauthorized way. I limit access to your personal data to those who
          have a business need to know.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Legal Rights</h2>
        <p>Under data protection laws, you have rights including:</p>
        <ul className="list-disc ml-6 mt-2 mb-4">
          <li>The right to access your personal data</li>
          <li>The right to correct inaccurate personal data</li>
          <li>The right to request erasure of your personal data</li>
          <li>The right to restrict processing of your personal data</li>
          <li>The right to data portability</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
        <p>
          If you have any questions about this Privacy Policy or my data
          practices, please contact me through the contact form on my website.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
