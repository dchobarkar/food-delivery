"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { CgProfile } from "react-icons/cg";

import AuthScreen from "../screens/AuthScreen";
import useUser from "../hooks/useUser";

const ProfileDropDown = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) setSignedIn(!!user);
  }, [loading, user]);

  const logoutHandler = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");

    toast.success("Log out successful!");
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4">
      {signedIn ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              src={user?.avatar?.url}
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>

            <DropdownItem key="settings">My Profile</DropdownItem>

            <DropdownItem key="all_orders">All Orders</DropdownItem>

            <DropdownItem key="team_settings">
              Apply for Seller account
            </DropdownItem>

            <DropdownItem key="logout" color="danger" onClick={logoutHandler}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <CgProfile
          className="text-3xl cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      )}
      {open && <AuthScreen setOpen={setOpen} />}
    </div>
  );
};

export default ProfileDropDown;
