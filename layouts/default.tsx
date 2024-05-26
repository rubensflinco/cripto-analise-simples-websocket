import { Link } from "@nextui-org/react";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.rubensflinco.com.br/"
          title="Site de Rubens Flinco"
        >
          <span className="text-default-600">Criado por </span>
          <p className="text-primary">Rubens Flinco</p>
        </Link>
      </footer>
    </div>
  );
}
