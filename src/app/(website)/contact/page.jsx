"use client"

import { useForm } from 'react-hook-form'
import { createContact } from '../../../Services/Contact_Service';
import { toast } from 'react-toastify';

function page() {

    const { register, handleSubmit, reset, formState: {errors, isSubmitting},} =useForm();


    const onSubmit=async(contactData)=>{
      try{
        const response= await createContact(contactData)

        if(response.success){
          toast.success("sent your Contact information !");
        }
        reset({
          name: "",
          email: "",
          subject: "",
          message: "",
      })

      }catch(error){
        console.log(error);
        toast.error(
          error.response?.data?.message || "Something went wrong"
        )

      }
    }
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

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Your Name" {...register("name", {required: "Name is Required"})}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055B3]" />
          {errors.name && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.name.message}
            </p>
          )}

        <input type="email" placeholder="Your Email" {...register("email", {required: "Email is Required"})}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055B3]" />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'> 
              {errors.email.message}
            </p>
          )}


        <input type="text" placeholder="Subject" {...register("subject", {required: "Subject is Required"})}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055B3]" />
          {errors.subject && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.subject.message}
            </p>
          )}
          
        <textarea rows="5" placeholder="Your Message" {...register("message", {required: "Message is Required"})}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055B3]"></textarea>

            {errors.message && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.message.message}  
            </p>
          )}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-[#002D62] text-white py-3 rounded-lg font-semibold hover:bg-[#0055B3] transition">
          {isSubmitting? "Sending..." : "Send Message"}
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
