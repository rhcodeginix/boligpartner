import { clsx, type ClassValue } from "clsx";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
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
      console.error("No document found for ID:", id);
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
      console.error("No document found for ID:", id);
    }
  } catch (error) {
    console.error("Error fetching supplier data:", error);
  }
};

export const fetchAdminData = async (id: string) => {
  try {
    const q = query(
      collection(db, "admin"),
      where("id", "==", id),
      orderBy("updatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0];

      return docRef.data();
    } else {
      console.error("No document found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Error fetching admin data:", error);
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

export function formatDateToDDMMYYYY(dateString: any) {
  const dateObject: any = new Date(dateString);

  if (isNaN(dateObject)) {
    return "Invalid Date";
  }

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();

  return `${day}.${month}.${year}`;
}

export function convertTimestamp(seconds: number, nanoseconds: number): string {
  const milliseconds = seconds * 1000 + nanoseconds / 1e6;

  const date = new Date(milliseconds);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("no-NO", options);
}

export const fetchAdminDataByEmail = async () => {
  const email: string | null = sessionStorage.getItem("Iplot_admin");

  if (email) {
    try {
      const q = query(collection(db, "admin"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0];

        return docRef.data();
      } else {
        console.error("No document found for Email:", email);
        return null;
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  }
};
