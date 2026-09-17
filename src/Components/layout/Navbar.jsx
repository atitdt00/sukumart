import Link from 'next/link'

function Navbar() {
  return (
    <>
        {/* <!-- ── NaV ── --> */}
  <nav className="hidden lg:block bg-[#003D84] z-10 top-17 sticky">
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <ul className="flex items-center list-none m-0 p-0 gLinkp-0">
        <li><Link href="/" className="nav-link active">Home</Link></li>
        <li><Link href="/categories" className="nav-link">Categories</Link></li>
        <li><Link href="/shop" className="nav-link">Shop</Link></li>
        <li>
          <Link href="/deals" className="nav-link">Deals
            <span className="bg-[#E53935] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">HOT</span>
          </Link>
        </li>
        <li><Link href="/track_order" className="nav-link">Track Order</Link></li>
        <li><Link href="/about" className="nav-link">about</Link></li>
        <li><Link href="/contact" className="nav-link">Contact</Link></li>
      </ul>
      <div className="flex items-center gap-2 text-[13px] font-bold text-[#F4C542] bg-amber-400/10 border border-amber-400/30 rounded-lg px-3.5 py-1.5">
      <i className="fa-solid fa-bolt text-sm"></i> Flash Sale — Up to 60% Off
      </div>
    </div>
  </nav>
    </>
  )
}

export default Navbar
