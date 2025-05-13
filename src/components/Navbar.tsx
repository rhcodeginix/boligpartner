import { Link, useLocation } from "react-router-dom";
import Ic_logo from "../assets/images/Ic_logo.svg";
import Ic_Avatar from "../assets/images/Ic_Avatar.svg";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <>
      <div
        className="px-6 py-4 flex items-center border-b border-gray2 justify-between sticky top-0 bg-white"
        style={{
          zIndex: 999,
        }}
      >
        <Link to={"/"}>
          <img src={Ic_logo} alt="logo" />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to={"/Husmodell"}
            className={`text-base font-medium py-2 px-3 rounded-[6px] ${
              currentPath === "/Husmodell" ||
              currentPath.startsWith("/se-husmodell/") ||
              currentPath === "/add-husmodell" ||
              currentPath.startsWith("/edit-husmodell/")
                ? "bg-lightPurple text-primary"
                : "text-black"
            }`}
          >
            Boligkonfigurator
          </Link>
          <Link
            to={"/Inventory"}
            className={`text-base font-medium py-2 px-3 rounded-[6px] ${
              currentPath === "/Inventory"
                ? "bg-lightPurple text-primary"
                : "text-black"
            }`}
          >
            Romkonfigurator
          </Link>
        </div>
        <div className="flex items-center gap-4 relative">
          <div
            className="flex items-center gap-2"
            // onClick={toggleDropdown}
          >
            <div className="h-[40px] w-[40px]">
              <img src={Ic_Avatar} alt="profile" className="rounded-full" />
            </div>
            {/* <img src={Ic_chevron_up} alt="arrow" className="rotate-180" /> */}
          </div>
        </div>
      </div>
    </>
  );
};
