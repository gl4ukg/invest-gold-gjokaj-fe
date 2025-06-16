import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Faqja që kërkuat nuk u gjet.</p>
      <Link href="/" className="text-blue-600 underline">
        Kthehu në faqen kryesore
      </Link>
    </div>
  );
}
