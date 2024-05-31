// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import "@/app/globals.css";
// import postOtp from "@/lib/postOtp";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import toastService from "@/services/toastService";

// const OtpPage = () => {
//   const inputs = useRef([]);

//   const [timer, setTimer] = useState(180);
//   const [resend, setResend] = useState(false);
//   const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

//   useEffect(() => {
//     const timerInterval = setInterval(() => {
//       setTimer((prevTimer) => {
//         if (prevTimer === 0) {
//           clearInterval(timerInterval);
//           return 0;
//         }
//         return prevTimer - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerInterval);
//   }, []);

//   useEffect(() => {
//     if (timer === 0) {
//       setResend(true);
//     }
//   }, [timer]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!/^[0-9]{1}$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab" && !e.metaKey) {
//         e.preventDefault();
//       }

//       const index = inputs.current.indexOf(e.target);

//       if (e.key === "Delete" || e.key === "Backspace") {
//         if (e.key === "Delete") {
//           if (index < inputs.current.length - 1) {
//             inputs.current[index + 1].focus();
//           }
//         } else if (e.key === "Backspace" && index > 0 && !e.target.value) {
//           inputs.current[index - 1].focus();
//         }
//       }
//     };

//     const handleInput = (e) => {
//       const { target } = e;
//       const index = inputs.current.indexOf(target);
//       if (target.value) {
//         if (index < inputs.current.length - 1) {
//           inputs.current[index + 1].focus();
//         }
//       }
//     };

//     const handleFocus = (e) => {
//       e.target.select();
//     };

//     const handlePaste = (e) => {
//       e.preventDefault();
//       const text = e.clipboardData.getData("text");
//       if (!new RegExp(`^[0-9]{${inputs.current.length}}$`).test(text)) {
//         return;
//       }
//       const digits = text.split("");
//       const newOtpValues = digits.map((digit, idx) => digit);
//       setOtpValues(newOtpValues);
//       inputs.current.forEach((input, index) => (input.value = digits[index]));
//     };

//     inputs.current.forEach((input) => {
//       input.addEventListener("input", handleInput);
//       input.addEventListener("keydown", handleKeyDown);
//       input.addEventListener("focus", handleFocus);
//       input.addEventListener("paste", handlePaste);
//     });

//     return () => {
//       inputs.current.forEach((input) => {
//         input.removeEventListener('input', handleInput);
//         input.removeEventListener('keydown', handleKeyDown);
//         input.removeEventListener('focus', handleFocus);
//         input.removeEventListener('paste', handlePaste);
//       });
//     };
//   }, []);

//   useEffect(() => {
//     console.log(otpValues, "otpval");
//   }, [otpValues]);

//   const handleChange = (index, value) => {
//     const newOtpValues = [...otpValues];
//     newOtpValues[index] = value;
//     setOtpValues(newOtpValues);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const stringOtp = otpValues.join("");
//     const result = await toastService.promise(postOtp(stringOtp));
//     console.log(otpValues);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <ToastContainer position="top-center" />
//       <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
//         <header className="mb-8">
//           <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
//           <p className="text-sm text-gray-500">Enter the 6-digit verification code that was sent to your email account.</p>
//         </header>
//         <form id="otp-form">
//           <div className="flex items-center justify-center gap-3">
//             {[...Array(6)].map((_, index) => (
//               <input
//                 key={index}
//                 name={`input${index}`}
//                 type="text"
//                 className="w-14 h-14 text-center text-2xl font-extrabold text-gray-900 bg-gray-100 border border-transparent hover:border-gray-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
//                 maxLength="1"
//                 value={otpValues[index]}
//                 ref={(el) => (inputs.current[index] = el)}
//                 onChange={(e) => handleChange(index, e.target.value)}
//               />
//             ))}
//           </div>
//           <div className="max-w-[260px] mx-auto mt-4">
//             <button
//               onClick={handleSubmit}
//               type="submit"
//               className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
//             >
//               Verify Account
//             </button>
//           </div>
//         </form>

//         {resend ? (
//           <div className="text-sm text-gray-500 mt-4">
//             Didn&apos;t receive code?{" "}
//             <a href="#0" className="font-medium text-indigo-500 hover:text-indigo-600">
//               Resend
//             </a>
//           </div>
//         ) : (
//           <div className="text-sm text-gray-500 mt-4">
//             Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OtpPage;








"use client";

import React, { useState, useRef, useEffect } from "react";
import "@/app/globals.css";
import postOtp from "@/lib/postOtp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastService from "@/services/toastService";

const OtpPage = () => {
  const inputs = useRef([]);

  const [timer, setTimer] = useState(180);
  const [resend, setResend] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setResend(true);
    }
  }, [timer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!/^[0-9]{1}$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab" && !e.metaKey) {
        e.preventDefault();
      }

      const index = inputs.current.indexOf(e.target);

      if (e.key === "Delete" || e.key === "Backspace") {
        if (e.key === "Delete") {
          if (index < inputs.current.length - 1) {
            inputs.current[index + 1].focus();
          }
        } else if (e.key === "Backspace" && index > 0 && !e.target.value) {
          inputs.current[index - 1].focus();
        }
      }
    };

    const handleInput = (e) => {
      const { target } = e;
      const index = inputs.current.indexOf(target);
      if (target.value) {
        if (index < inputs.current.length - 1) {
          inputs.current[index + 1].focus();
        }
      }
    };

    const handleFocus = (e) => {
      e.target.select();
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text");
      if (!new RegExp(`^[0-9]{${inputs.current.length}}$`).test(text)) {
        return;
      }
      const digits = text.split("");
      const newOtpValues = digits.map((digit, idx) => digit);
      setOtpValues(newOtpValues);
      inputs.current.forEach((input, index) => (input.value = digits[index]));
    };

    inputs.current.forEach((input) => {
      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleKeyDown);
      input.addEventListener("focus", handleFocus);
      input.addEventListener("paste", handlePaste);
    });


  }, []);

  useEffect(() => {
    console.log(otpValues, "otpval");
  }, [otpValues]);

  const handleChange = (index, value) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stringOtp = otpValues.join("");
    const result = await toastService.promise(postOtp(stringOtp));
    console.log(otpValues);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ToastContainer position="top-center" />
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
          <p className="text-sm text-gray-500">Enter the 6-digit verification code that was sent to your email account.</p>
        </header>
        <form id="otp-form">
          <div className="flex items-center justify-center gap-3">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                name={`input${index}`}
                type="text"
                className="w-14 h-14 text-center text-2xl font-extrabold text-gray-900 bg-gray-100 border border-transparent hover:border-gray-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                maxLength="1"
                value={otpValues[index]}
                ref={(el) => (inputs.current[index] = el)}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
            >
              Verify Account
            </button>
          </div>
        </form>

        {resend ? (
          <div className="text-sm text-gray-500 mt-4">
            Didn&apos;t receive code?{" "}
            <a href="#0" className="font-medium text-indigo-500 hover:text-indigo-600">
              Resend
            </a>
          </div>
        ) : (
          <div className="text-sm text-gray-500 mt-4">
            Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpPage;

