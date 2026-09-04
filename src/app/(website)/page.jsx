import React from 'react'
import HeroSection from '../../Components/home/HeroSection'
import Categories_Section from '../../Components/home/Categories_Section'
import Featured_products from '../../Components/home/Featured_products'

function page() {
  return (
    <>
     <HeroSection/>
     <Categories_Section/>
     <Featured_products/> 
    </>
  )
}

export default page
