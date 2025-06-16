import { useEffect, useState } from "react";
import { Huskonfigurator } from "./Huskonfigurator";
import { Floor } from "./floor";
import { AllFloor } from "./allFloor";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-hot-toast";

export const Romkonfigurator: React.FC<{ Prev: any; Next: any }> = ({
  // Prev,
  Next,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    let called = false;
    const fetchOrCreateData = async () => {
      if (called) return;
      called = true;

      try {
        const formatDate = (date: Date) => {
          return date
            .toLocaleString("sv-SE", { timeZone: "UTC" })
            .replace(",", "");
        };

        const q = query(
          collection(db, "room_configurator"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const existingDoc = snapshot.docs[0];
          navigate(`/Bolig-configurator/${existingDoc.id}`, {
            replace: true,
          });
        } else {
          const newId = uuidv4();
          const newDocRef = doc(db, "room_configurator", newId);
          await setDoc(newDocRef, {
            createdAt: formatDate(new Date()),
            updatedAt: formatDate(new Date()),
          });
          navigate(`/Bolig-configurator/${newId}`, { replace: true });
        }
      } catch (error) {
        console.error("Firestore operation failed:", error);
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
        });
      }
    };

    fetchOrCreateData();
  }, [navigate]);

  return (
    <>
      <div className="bg-lightPurple px-8 py-3">
        <h3 className="text-darkBlack font-medium text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] mb-2">
          Romkonfigurator
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          Her laster du opp plantegninger som bruker AI til å trekke ut alle
          rommene, du kan så konfigurere hvert enkelt rom.
        </p>
      </div>
      <div className="mb-12">
        {activeTab === 0 && <Huskonfigurator setActiveTab={setActiveTab} />}
        {activeTab === 1 && <Floor setActiveTab={setActiveTab} />}
        {activeTab === 2 && (
          <AllFloor setActiveTab={setActiveTab} Next={Next} />
        )}
      </div>

      {/* <div
        className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 rounded-b-lg p-4"
        style={{
          boxShadow: "0px -3px 4px -2px #1018280F, 0px -4px 8px -2px #1018281A",
        }}
      >
        <div
          onClick={() => {
            Prev();
            const currIndex = 0;
            localStorage.setItem("currIndexBolig", currIndex.toString());
          }}
        >
          <Button
            text="Tilbake"
            className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          />
        </div>
        <Button
          text="Neste"
          className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => Next()}
        />
      </div> */}
    </>
  );
};
