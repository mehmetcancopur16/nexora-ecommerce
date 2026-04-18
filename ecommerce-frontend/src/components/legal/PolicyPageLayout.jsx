import { motion } from "framer-motion"
import { Link } from "react-router"
import Container from "../common/Container"

const MotionDiv = motion.div

function PolicyPageLayout({ title, description, children }) {
  return (
    <section className="pb-16 pt-4">
      <Container>
        <nav className="mb-6 text-sm text-nexora-muted">
          <Link to="/" className="hover:text-nexora-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-nexora-text">{title}</span>
        </nav>

        <MotionDiv initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <header className="mb-10 max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-nexora-text sm:text-4xl">{title}</h1>
            {description ? <p className="mt-3 text-base text-nexora-muted">{description}</p> : null}
          </header>

          <div className="max-w-3xl space-y-10">{children}</div>
        </MotionDiv>
      </Container>
    </section>
  )
}

export default PolicyPageLayout
