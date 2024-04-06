import { Metadata } from "next";
import ContractPage from "./contract";

export const metadata:Metadata = {
  title:'Contract',
  description:'Contract page',
  keywords:['Contract','Address'],
}

export default function Contract() {
  return (
    <ContractPage />
  )
}