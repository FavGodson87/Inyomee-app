import React from "react";
import { assets } from "../../assets/assets";
import { IoMdCloudDownload } from "react-icons/io";


const AppDownload = () => {
  const storeStyle =
    "will-change-transform hover:scale-105 transition-all duration-100 ease-in-out cursor-pointer";

  return (
    <div
      id="app-download"
      className="relative overflow-hidden w-auto h-auto lg:h-[400px] bg-white
      mx-5 my-24 sm:m-12 lg:pr-36 md:my-20 md:mx-5 rounded-4xl 
      flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-6"
    >
      {/* mobile mockup */}
      <div className="relative z-0 flex justify-center items-center w-full lg:w-auto lg:flex-shrink-0 lg:-mr-20">
        <img
          src="/mobile-app.png"
          alt="Mobile app preview"
          className="w-[280px] sm:w-[350px] md:w-[450px] lg:w-[550px] xl:w-[650px] 2xl:w-[750px] h-auto object-contain"

        />
      </div>

      {/* texts and stores */}
      <div
        className="relative z-10 flex flex-col gap-8 px-4 md:px-6 
      lg:px-0 lg:pl-4 text-center lg:text-left max-w-[500px] -mt-8 lg:mt-0"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-green-500 text-3xl md:text-4xl lg:text-5xl font-bold">
            Cravings don't wait, <br /> why should you?
          </h2>
          <span className="flex items-center justify-center lg:justify-start gap-1">
            <IoMdCloudDownload className="text-[15px] sm:text-[18px] lg:text-[22px] mb-1" />
            <p className="text-[#2e2e2e] text-[12px] sm:text-[15px] lg:text-[17px] font-medium">
              Download the app & enjoy goodies anytime!
            </p>
          </span>
        </div>

        {/* App Store buttons */}
        <div
          className="flex flex-col lg:flex-row gap-3 items-center justify-center lg:justify-start"
        >
          <img
            src={assets.play_store}
            alt="Download on Google Play"
            className={`${storeStyle} w-[150px] h-auto`}
          />
          <img
            src={assets.app_store}
            alt="Download on Apple App Store"
            className={`${storeStyle} w-[150px] h-auto`}
          />
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
