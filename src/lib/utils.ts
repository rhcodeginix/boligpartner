import { clsx, type ClassValue } from "clsx";
import {
  collection,
  doc,
  getDoc,
  getDocs,
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
    if (id) {
      const husmodellDocRef = doc(db, "housemodell_configure_broker", id);
      const docSnap = await getDoc(husmodellDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    }
  } catch (error) {
    console.error("Error fetching husmodell data:", error);
  }
};
export const fetchProjectsData = async (id: string) => {
  try {
    if (id) {
      const husmodellDocRef = doc(db, "projects", id);
      const docSnap = await getDoc(husmodellDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
  }
};
export const fetchRoomData = async (id: string) => {
  try {
    if (id) {
      const husmodellDocRef = doc(db, "room_configurator", id);
      const docSnap = await getDoc(husmodellDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    }
  } catch (error) {
    console.error("Error fetching husmodell data:", error);
  }
};

export const fetchBankLeadData = async (id: string) => {
  try {
    if (id) {
      const docRef = doc(db, "bank_leads", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    }
  } catch (error) {
    console.error("Error fetching bank lead data:", error);
  }
};

export const fetchSupplierData = async (id: string) => {
  try {
    if (id) {
      const supplierDocRef = doc(db, "suppliers", id);
      const docSnap = await getDoc(supplierDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No document found for ID:", id);
      }
    }
  } catch (error) {
    console.error("Error fetching supplier data:", error);
  }
};

export const fetchAdminData = async (id: string) => {
  try {
    const q = query(collection(db, "admin"), where("id", "==", id));
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

export function formatCurrency(value: number | string) {
  const number =
    typeof value === "string"
      ? Number(value.replace(/\s/g, "").replace(/kr/i, ""))
      : value;

  if (isNaN(Number(number))) return value;

  const formatted = new Intl.NumberFormat("no-NO", {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: 0,
  }).format(number);

  return `kr ${formatted}`;
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
  const email: string | null = localStorage.getItem("Iplot_admin_bolig");

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

export const fetchLeadData = async (id: string) => {
  try {
    const supplierDocRef = doc(db, "leads_from_supplier", id);
    const docSnap = await getDoc(supplierDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No document found for ID:", id);
    }
  } catch (error) {
    console.error("Error fetching lead data:", error);
  }
};
export function formatTimestamp(timestamp: any) {
  const date = new Date(timestamp?.seconds * 1000);

  const day = date.getDate();
  const month = date.toLocaleString("no-NO", { month: "long" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12;
  hours = hours % 12 || 12;

  const period = isPM ? "pm" : "am";

  return `${day}. ${month} ${year} | ${hours}:${minutes} ${period}`;
}

export function convertToFullDateString(timestamp: any) {
  if (!timestamp?.seconds) return "";

  const date = new Date(timestamp?.seconds * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
export function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function TimestampDisplay(dato: any) {
  const date = new Date(
    dato.seconds * 1000 + Math.floor(dato.nanoseconds / 1000000)
  );

  const formattedDate = date.toISOString().split("T")[0].replace(/-/g, ".");

  return formattedDate;
}
export function formatSpaceSeparatedToNOK(value: number | string) {
  const number =
    typeof value === "string"
      ? Number(value.replace(/\s/g, "").replace(/kr/i, ""))
      : value;

  if (isNaN(Number(number))) return value;

  const formatted = new Intl.NumberFormat("no-NO", {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: 0,
  }).format(number);

  return `kr ${formatted}`;
}
