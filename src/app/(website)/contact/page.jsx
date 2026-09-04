import React from 'react'

function page() {
  return (
    <>
      
{/* <!-- ── CONTACT PAGE ── --> */}
<section className="max-w-7xl mx-auto px-6 py-16">
  <div className="text-center mb-12">
    <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-800">
      Contact <span className="text-[#0055B3]">Us</span>
    </h1>
    <p className="text-gray-500 mt-2 text-sm md:text-base">
      We’re here to help. Reach out to us anytime.
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

    {/* <!-- Contact Form --> */}
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Send Message</h2>

      <form className="space-y-4">
        <input type="text" placeholder="Your Name"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055B3]" />

        <input type="email" placeholder="Your Email"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055B3]" />

        <input type="text" placeholder="Subject"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055B3]" />

        <textarea rows="5" placeholder="Your Message"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055B3]"></textarea>

        <button type="submit"
          className="w-full bg-[#002D62] text-white py-3 rounded-lg font-semibold hover:bg-[#0055B3] transition">
          Send Message
        </button>
      </form>
    </div>

    {/* <!-- Contact Info --> */}
    <div className="space-y-6">

      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-2">📍 Address</h3>
        <p className="text-gray-600 text-sm">Kathmandu, Nepal</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-2">📞 Phone</h3>
        <p className="text-gray-600 text-sm">+977-98XXXXXXXX</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-2">✉ Email</h3>
        <p className="text-gray-600 text-sm">support@sukumart.com</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-2">⏰ Working Hours</h3>
        <p className="text-gray-600 text-sm">Sun - Fri: 9AM - 6PM</p>
      </div>

    </div>

  </div>
</section>
    </>
  )
}

export default page
