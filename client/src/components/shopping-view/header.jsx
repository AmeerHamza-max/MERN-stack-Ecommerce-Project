import React, { useState, useRef, useEffect } from "react";
import { HousePlug, Menu, ShoppingCart, X, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { shoppingViewHeaderMenuItems } from "@/config";
import { logoutUser } from "@/store/auth-slice";

const HeaderRightContent = ({ isMobile = false, onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserInitials = (username) => {
    if (!username) return "U";
    const parts = username.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
    setUserMenuOpen(false);
    if (onClick) onClick();
  };

  return (
    <div className={`flex ${isMobile ? "flex-col gap-2" : "flex-row gap-4"} relative`}>
      <button className="p-2 rounded-md hover:bg-gray-800 transition">
        <ShoppingCart className="w-6 h-6 text-gray-100" />
      </button>

      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="px-3 py-1 rounded-full bg-gray-800 text-white flex items-center font-medium hover:bg-gray-700 transition"
        >
          {getUserInitials(user?.username)}
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-900 text-gray-100 rounded-md shadow-lg z-50">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700">
              <User className="w-5 h-5 text-gray-100" />
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-700 transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuItems = ({ onClick }) => (
  <nav className="flex flex-col lg:flex-row items-center justify-center gap-6">
    {shoppingViewHeaderMenuItems.map((menuItem) => (
      <Link
        key={menuItem.id}
        to={menuItem.path}
        className="text-gray-100 text-sm font-medium hover:text-amber-500 transition"
        onClick={onClick}
      >
        {menuItem.label}
      </Link>
    ))}
  </nav>
);

export const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    if (mobileMenuRef.current) {
      setMenuHeight(mobileMenuOpen ? mobileMenuRef.current.scrollHeight : 0);
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2 text-gray-100">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center">
          {isAuthenticated && <MenuItems />}
        </div>

        {isAuthenticated && <div className="hidden lg:flex"><HeaderRightContent /></div>}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-800 transition"
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-gray-100" /> : <Menu className="h-6 w-6 text-gray-100" />}
        </button>
      </div>

      <div
        className="lg:hidden overflow-hidden bg-black border-t border-gray-800 transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: `${menuHeight}px` }}
        ref={mobileMenuRef}
      >
        {isAuthenticated && (
          <div className="flex flex-col gap-4 p-4">
            <MenuItems onClick={() => setMobileMenuOpen(false)} />
            <HeaderRightContent isMobile onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};
