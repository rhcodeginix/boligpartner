import { clsx, type ClassValue } from "clsx";
import { doc, getDoc } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { db } from "../config/firebaseConfig";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchHusmodellData = async (id: string) => {
  try {
    const husmodellDocRef = doc(db, "house_model", id);
    const docSnap = await getDoc(husmodellDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No document found for ID:", id);
    }
  } catch (error) {
    console.error("Error fetching husmodell data:", error);
  }
};

export const fetchSupplierData = async (id: string) => {
  try {
    const supplierDocRef = doc(db, "suppliers", id);
    const docSnap = await getDoc(supplierDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No document found for ID:", id);
    }
  } catch (error) {
    console.error("Error fetching husmodell data:", error);
  }
};

export function formatDateTime(inputDateTime: string) {
  const date = new Date(inputDateTime);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

export function formatCurrency(nokValue: any) {
  let number = nokValue.replace(/\s/g, "");
  return new Intl.NumberFormat("de-DE").format(Number(number)) + " NOK";
}

export const phoneNumberValidations: Record<string, (num: string) => boolean> =
  {
    "+47": (num) => num.length === 8,
  };
