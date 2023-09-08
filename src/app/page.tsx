'use client'

import EnterTheCommunity from "@/components/EnterTheCommunity";
import Header from "@/components/Header";
import LatestRecipes from "@/components/LatestRecipes";
import Modal from "@/components/Modal";
import { IngredientsContextProvider } from "@/context/IngredientsContext";
export default function Home() {

  return (
    <IngredientsContextProvider>
      <main className="">
        <Header/>
        <LatestRecipes/>
        <EnterTheCommunity/>
        <Modal/>
      </main>
    </IngredientsContextProvider>
  )
}