import { Link } from "react-router"

function NotFound() {
  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-nexora-accent">404</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900">Sayfa Bulunamadi</h1>
      <p className="mt-3 text-sm text-slate-600">
        Aradiginiz sayfayi bulamadik ama harika urunlerimiz sizi bekliyor.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
      >
        Ana Sayfaya Don
      </Link>
    </section>
  )
}

export default NotFound
