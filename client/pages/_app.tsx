import PageLayout from "@/layouts/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Analyzer",
  description: "Generated using Next js",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
  <PageLayout>
    <Component {...pageProps} />
  </PageLayout>);
}
