// components/layout/footer/tsx      
      
export default function Footer() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Décoration de fond : Teinte subtile bleutée */}
      
      <footer className="absolute bottom-8 text-sm text-zinc-400">
        © {new Date().getFullYear()} EXCELLENT SERVICE (EXLS). Tous droits réservés.
      </footer>

    </main>
  )
}