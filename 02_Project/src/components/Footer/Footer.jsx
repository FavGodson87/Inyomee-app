import React from "react";
import { FaFacebook } from "react-icons/fa";
import { PiInstagramLogoLight } from "react-icons/pi";
import { FaXTwitter } from "react-icons/fa6";
import { assets } from "../../assets/assets";

const Footer = () => {
  const iconStyle =
    "p-2 rounded-full w-[40px] h-[40px] border-1 border-[#2e2e2e] flex items-center justify-center cursor-pointer";

  return (
    <div
      id="footer"
      className="text-[#2e2e2e] bg-green-500/5 flex flex-col 
      gap-8 px-20 py-14 mb-10 lg:mb-0 xl:mb-0 mx-5 rounded-2xl
      backdrop-blur-sm shadow-xl"
    >
      {/* Footer Content (3 sections in one row) */}
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* footer content left */}
        <div className="max-w-sm">
          <img src={assets.inyo} alt="" className="w-30 h-auto mb-4" />
          <p className="mb-4 font-light">
            Bringing smiles through tasty treats every day. From oven to table,
            always fresh, always delicious.
          </p>

          <div className="flex items-center gap-3 mt-4 ml-0">
            <div className={`${iconStyle}`}>
              <PiInstagramLogoLight className="text-[25px]" />
            </div>
            <div className={`${iconStyle}`}>
              <FaFacebook className="text-[20px]" />
            </div>
            <div className={`${iconStyle}`}>
              <FaXTwitter className="text-[20px]" />
            </div>
          </div>
        </div>

        {/* footer content center */}
        <div>
          <h2 className="font-semibold mb-3">COMPANY</h2>
          <ul className="space-y-2 font-light">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* footer content right */}
        <div>
          <h2 className="font-semibold mb-3">GET IN TOUCH</h2>
          <ul className="space-y-2 font-light">
            <li>+234 800 123 4567</li>
            <li>info@inyomee.com</li>
          </ul>
        </div>
      </div>

      {/* line */}
      <hr className="border-neutral-500 mt-4" />

      {/* copyright */}
      <p className="text-center text-sm">
        © 2025 Inyomee. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
