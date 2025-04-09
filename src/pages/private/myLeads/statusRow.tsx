import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebaseConfig";

export const StatusCell: React.FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchPreferredHouse = async () => {
      if (!id) return;

      const logsCollectionRef = collection(
        db,
        "leads_from_supplier",
        String(id),
        "followups"
      );

      try {
        const logsSnapshot = await getDocs(logsCollectionRef);

        const fetchedLogs: any = logsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(fetchedLogs);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchPreferredHouse();
  }, [id]);

  return (
    <>
      {data && data.length > 0 ? (
        <div className="text-[#994700] flex items-center justify-between w-max bg-[#FFEBD9] rounded-[16px] py-[2px] px-2">
          Active
        </div>
      ) : (
        <div className="text-darkGreen flex items-center justify-between w-max bg-lightGreen rounded-[16px] py-[2px] px-2">
          New
        </div>
      )}
    </>
  );
};
