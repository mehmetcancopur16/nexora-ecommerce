import { Globe, Mail, MapPin, Phone, Send } from "lucide-react"
import { Link } from "react-router"

const quickLinks = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Urunler", to: "/products" },
  { label: "Sepet", to: "/cart" },
  { label: "Profil", to: "/profile" },
]

const helpLinks = [
  { label: "Iade Politikasi", to: "/products" },
  { label: "Teslimat Bilgisi", to: "/products" },
  { label: "Gizlilik", to: "/register" },
  { label: "Destek", to: "/login" },
]

function Footer() {
  return (
    <footer className="mt-12 border-t border-nexora-line bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-2xl font-bold text-nexora-primary">Nexora</p>
          <p className="max-w-sm text-sm leading-7 text-nexora-muted">
            Premium e-ticaret deneyimi, guvenli odeme altyapisi ve guclu lojistik agi ile modern alisverisin yeni
            standardi.
          </p>
          <div className="flex gap-3 text-nexora-muted">
            {[Globe, Mail, Send].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="rounded-full border border-nexora-line p-2 transition hover:border-nexora-primary hover:text-nexora-primary"
                aria-label="social link"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">Hizli Linkler</h3>
          <div className="mt-4 space-y-2">
            {quickLinks.map((item) => (
              <Link key={item.label} to={item.to} className="block text-sm text-nexora-muted transition hover:text-nexora-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">Yardim ve Politika</h3>
          <div className="mt-4 space-y-2">
            {helpLinks.map((item) => (
              <Link key={item.label} to={item.to} className="block text-sm text-nexora-muted transition hover:text-nexora-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">Iletisim</h3>
          <div className="mt-4 space-y-3 text-sm text-nexora-muted">
            <p className="inline-flex items-center gap-2">
              <MapPin size={15} />
              Istanbul, Turkiye
            </p>
            <p className="inline-flex items-center gap-2">
              <Phone size={15} />
              +90 212 000 00 00
            </p>
            <p className="inline-flex items-center gap-2">
              <Mail size={15} />
              hello@nexora.com
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-nexora-line py-5 text-center text-xs text-nexora-muted">
        Copyright {new Date().getFullYear()} Nexora. Tum haklari saklidir.
      </div>
    </footer>
  )
}

export default Footer
