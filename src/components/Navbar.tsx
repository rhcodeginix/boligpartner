import { Link, useLocation } from "react-router-dom";
import Ic_logo from "../assets/images/Ic_logo.svg";
import Ic_profile_image from "../assets/images/Ic_profile_image.svg";
import Ic_bell from "../assets/images/Ic_bell.svg";
import Ic_search from "../assets/images/Ic_search.svg";
import Ic_settings from "../assets/images/Ic_settings.svg";

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
            to={"/"}
            className={`text-base font-medium py-2 px-3 rounded-[6px] ${
              currentPath === "/" ? "bg-lightPurple text-primary" : "text-black"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to={"/Leverandorer"}
            className={`text-base font-medium py-2 px-3 rounded-[6px] ${
              currentPath === "/Leverandorer" ||
              currentPath.startsWith("/edit-legg-til-leverandor/") ||
              currentPath === "/legg-til-leverandor"
                ? "bg-lightPurple text-primary"
                : "text-black"
            }`}
          >
            Leverandører
          </Link>
          <Link
            to={"/Husmodeller"}
            className={`text-base font-medium py-2 px-3 rounded-[6px] ${
              currentPath === "/Husmodeller" ||
              currentPath.startsWith("/se-husmodell/") ||
              currentPath === "/add-husmodell" ||
              currentPath.startsWith("/edit-husmodell/")
                ? "bg-lightPurple text-primary"
                : "text-black"
            }`}
          >
            Husmodeller
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-[40px] w-[40px] flex items-center justify-center">
              <img src={Ic_search} alt="search" />
            </div>
            <div className="h-[40px] w-[40px] flex items-center justify-center">
              <img src={Ic_settings} alt="setting" />
            </div>
            <div className="h-[40px] w-[40px] flex items-center justify-center">
              <img src={Ic_bell} alt="bell" />
            </div>
          </div>
          <div className="h-[40px] w-[40px]">
            <img src={Ic_profile_image} alt="profile" />
          </div>
        </div>
      </div>
    </>
  );
};
