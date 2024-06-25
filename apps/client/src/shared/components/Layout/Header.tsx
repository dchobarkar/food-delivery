import NavItems from "../NavItems";
import ProfileDropDown from "../ProfileDropDown";
import styles from "../../../utils/styles";

const Header = () => {
  return (
    <header className="w-full bg-[#0A0713]">
      <div className="w-[90%] m-auto h-[80px] flex items-center justify-between">
        <h1 className={`${styles.logo}`}>DarshanWebDev</h1>

        <NavItems />

        <ProfileDropDown />
      </div>
    </header>
  );
};

export default Header;
