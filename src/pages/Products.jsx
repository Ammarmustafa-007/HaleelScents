import React from 'react'
import {ProductCard} from '../imports/ProductCard'
import { Productapi } from '../context/Productapi'
import { Navbar } from '../components/Navbar'
export const Products = () => {

  return (
   <>
   {/* <ProductCard proddata={sample} /> */}
    <Navbar/>
   <Productapi/>

   </>
  )
}
