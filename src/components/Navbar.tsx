import { Link, useLocation, useNavigate } from "react-router-dom";
import Ic_logo from "../assets/images/Ic_logo.png";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Ic_chevron_up from "../assets/images/Ic_chevron_up.svg";
import { fetchAdminDataByEmail } from "../lib/utils";
import { LogOut, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  useEffect(() => {
    const user: any = localStorage.getItem("Iplot_admin_bolig");
    setLoginUser(user);
  }, [loginUser]);

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
      localStorage.removeItem("Iplot_admin_bolig");
      setIsDropdownOpen(false);
      navigate("/login");
      toast.success("Logout successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const [isPhoto, setIsPhoto] = useState(null);

  const [name, setName] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAdminDataByEmail();

      if (data) {
        setIsPhoto(data?.photo);
        setName(data?.name || data?.f_name);
      }
    };

    getData();
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <div
        className="px-4 md:px-6 py-4 flex items-center border-b border-gray2 justify-between sticky top-0 bg-white"
        style={{
          zIndex: 999,
        }}
        id="navbar"
      >
        <div className="flex items-center gap-2">
          <Menu onClick={toggleDrawer} className="md:hidden text-primary" />
          <Link to={"/"}>
            <img src={Ic_logo} alt="logo" className="w-[196px] lg:w-auto" />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <Link
            to={"/Husmodell"}
            className={`text-base font-medium py-2 px-3 rounded-[6px] ${
              currentPath === "/Husmodell" ||
              currentPath.startsWith("/se-husmodell/") ||
              currentPath === "/add-husmodell" ||
              currentPath.startsWith("/se-series/") ||
              currentPath.startsWith("/edit-husmodell/")
                ? "bg-lightGreen text-primary"
                : "text-black"
            }`}
          >
            Boligkonfigurator
          </Link>
          <Link
            to={"/Bolig-configurator"}
            className={`text-base font-medium py-2 px-3 rounded-[6px] ${
              currentPath === "/Room-Configurator" ||
              currentPath === "/Bolig-configurator" ||
              currentPath.startsWith("/Room-Configurator/")
                ? "bg-lightGreen text-primary"
                : "text-black"
            }`}
            onClick={() => {
              const currIndex = 0;
              const currVerticalIndex = 1;
              localStorage.setItem("currIndexBolig", currIndex.toString());
              localStorage.setItem(
                "currVerticalIndex",
                currVerticalIndex.toString()
              );
            }}
          >
            Oppmelding
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-3 relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            {isPhoto ? (
              <div className="w-8 h-8 md:h-[40px] md:w-[40px]">
                <img src={isPhoto} alt="profile" className="rounded-full" />
              </div>
            ) : (
              <div className="w-8 h-8 md:h-[40px] md:w-[40px] flex items-center justify-center border border-primary bg-lightGreen rounded-full">
                {name?.[0]}
              </div>
            )}
            <img src={Ic_chevron_up} alt="arrow" className="rotate-180" />
          </div>
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-shadow1 rounded-md shadow-lg p-2 top-10 border border-gray2"
              ref={dropdownRef}
            >
              <Link
                to={"/login"}
                className="px-3 py-2 text-sm hover:bg-lightGreen text-black w-full text-left cursor-pointer flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 text-primary" /> Logout
              </Link>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          transition: "transform 1s, box-shadow 1s",
          transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",
          ...(isDrawerOpen ? { background: "rgba(0, 0, 0, 0.6)" } : {}),
          zIndex: 999999,
        }}
        className={`fixed top-0 left-0 w-full h-screen z-50`}
      >
        <div className="bg-white h-full px-4 sm:px-5 md:px-8 lg:px-10 big:px-[120px] w-[85%]">
          <div className="flex items-center justify-between py-4 mb-4">
            <div className="gap-[12px] flex items-center">
              <img src={Ic_logo} alt="logo" className="w-[196px] lg:w-auto" />
            </div>
            <button onClick={toggleDrawer} className="text-3xl">
              <X className="text-primary" />
            </button>
          </div>
          <div className="flex flex-col items-start font-medium gap-3">
            <Link
              to={"/Husmodell"}
              className={`text-base font-medium py-2 px-3 rounded-[6px] ${
                currentPath === "/Husmodell" ||
                currentPath.startsWith("/se-husmodell/") ||
                currentPath.startsWith("/se-series/") ||
                currentPath === "/add-husmodell" ||
                currentPath.startsWith("/edit-husmodell/")
                  ? "bg-lightGreen text-primary"
                  : "text-black"
              }`}
            >
              Boligkonfigurator
            </Link>
            <Link
              to={"/Bolig-configurator"}
              className={`text-base font-medium py-2 px-3 rounded-[6px] ${
                currentPath === "/Room-Configurator" ||
                currentPath === "/Bolig-configurator" ||
                currentPath.startsWith("/Room-Configurator/")
                  ? "bg-lightGreen text-primary"
                  : "text-black"
              }`}
              onClick={() => {
                const currIndex = 0;
                const currVerticalIndex = 1;
                localStorage.setItem("currIndexBolig", currIndex.toString());
                localStorage.setItem(
                  "currVerticalIndex",
                  currVerticalIndex.toString()
                );
              }}
            >
              Oppmelding
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
