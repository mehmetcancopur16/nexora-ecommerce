import { Link, useParams } from "react-router"

function OrderSuccess() {
  const { id } = useParams()

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg shadow-emerald-100/50">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl animate-pulse">
        ✓
      </div>

      <h1 className="text-3xl font-bold text-emerald-700">Siparisiniz Alindi!</h1>
      <p className="mt-3 text-sm text-slate-600">
        Siparisiniz basariyla olusturuldu. En kisa surede kargoya hazirlanacak.
      </p>

      <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Siparis Numaraniz: <span className="font-semibold text-slate-900">{id}</span>
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/products"
          className="rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Alisverise Devam Et
        </Link>
        <Link
          to="/"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary"
        >
          Ana Sayfaya Don
        </Link>
      </div>
    </section>
  )
}

export default OrderSuccess
