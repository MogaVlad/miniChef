'use client'

import EnterTheCommunity from "@/components/EnterTheCommunity";
import Header from "@/components/Header";
import PopularRecipes from "@/components/PopularRecipes";
import Modal from "@/components/Modal";
import { IngredientsContextProvider } from "@/context/IngredientsContext";
export default function Home() {

  return (
    <IngredientsContextProvider>
      <main className="">
        <Header/>
        <PopularRecipes/>
        <EnterTheCommunity/>
        <Modal/>
      </main>
    </IngredientsContextProvider>
  )
}