import { Link, useLocation, useNavigate } from "react-router-dom";
import Ic_logo from "../assets/images/Ic_logo.svg";
import Ic_profile_image from "../assets/images/Ic_profile_image.svg";
import Ic_bell from "../assets/images/Ic_bell.svg";
import Ic_search from "../assets/images/Ic_search.svg";
import Ic_settings from "../assets/images/Ic_settings.svg";
import Ic_chevron_up from "../assets/images/Ic_chevron_up.svg";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("Iplot_admin");
      setIsDropdownOpen(false);
      navigate("/login");
      toast.success("Logout successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
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
        <div className="flex items-center gap-4 relative">
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
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="h-[40px] w-[40px]">
              <img src={Ic_profile_image} alt="profile" />
            </div>
            <img src={Ic_chevron_up} alt="arrow" className="rotate-180" />
          </div>
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-shadow1 rounded-md shadow-lg p-2 top-10 border border-gray2"
              ref={dropdownRef}
            >
              <Link
                to={"/login"}
                className="block px-4 py-2 text-sm hover:bg-lightPurple text-black w-full text-left cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
