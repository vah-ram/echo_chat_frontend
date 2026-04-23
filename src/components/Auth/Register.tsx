import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import { toast, Toaster } from "sonner";
import axiosInstance from "../../lib/axios";

function Register() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const [IsVerificationCodeSent, setIsVerificationCodeSent] = useState(false);

  const [formDetails, setFormDetails] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPass: ""
  });

  const toastSettings = {
    position: "top-center",
    closeButton: true,
    duration: 2000
  }

  const registerUserFunc = async() => {
    if(!formDetails.username || !formDetails.phone || 
      !formDetails.email || !formDetails.password || !formDetails.confirmPass) {
      toast.error("Խնդրում ենք լրացնել բոլոր տվյալները", toastSettings as object);
      return;
    };

    if(formDetails.password !== formDetails.confirmPass) {
      toast.error("Ձեր գաղտնաբառերը չեն համընկում", toastSettings as object);
      return;
    }

    if(formDetails.password.length < 8) {
      toast.error(
        "Ձեր գաղտնաբառերը պետք է ներառի առնվազն 8 տառ", 
        toastSettings as object
      );
      return;
    }

    try {
      const response = await axiosInstance.post(API.registerUrl, {
        username: formDetails.username,
        phone: formDetails.phone,
        email: formDetails.email,
        password: formDetails.password
      });

      if(response.data) {
        setIsVerificationCodeSent(true);
      } else {
        return;
      }

    } catch(err: any) {
      toast.error(err.response?.data?.message, toastSettings as object);
    } 
  };

  const verifyEmailFunc = async() => {
    try {
      if(code.some(digit => digit === "")) {
        toast.error("Խնդրում ենք մուտքագրել վեցանիշ կոդը", toastSettings as object);
        return;
      }

      const res = await axiosInstance.post(API.verifyEmailUrl, {
        email: formDetails.email,
        code: code.join("")
      });

      if(res.data) {
        localStorage.setItem("accessToken", res.data.accessToken);
        navigate('/')
      }
    } catch(err: any) {
      toast.error(err.response?.data?.message, toastSettings as object);
    }
  }

  return (
    <>
      <div className="w-full h-full bg-gray-100
        flex flex-col items-center justify-center">
      {
        IsVerificationCodeSent ? (
          <>
             <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-6">
            
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  className="sm:w-7 sm:h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Միանալ Echo-ին
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Հաստատեք ձեր E-mail հասցեն
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm 
                            p-5 sm:p-8 w-full max-w-md">
              
              <p className="text-center text-gray-500 text-sm mb-6">
                Մենք ուղարկեցինք 6-նիշ կոդ ձեր էլ. փոստին։ Մուտքագրեք կոդը ստորև։
              </p>

              <div className="flex justify-center gap-2 sm:gap-4 mb-6">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-14 sm:h-14 
                              text-center text-lg sm:text-xl font-bold 
                              bg-gray-100 rounded-xl outline-none 
                              focus:ring-2 focus:ring-gray-400 text-gray-900"
                  />
                ))}
              </div>

              <button 
                className="w-full bg-gray-900 text-white 
                          font-semibold py-3 rounded-xl 
                          hover:bg-gray-800 transition-colors"
                onClick={verifyEmailFunc}
              >
                Հաստատել
              </button>

              <p className="text-center text-sm text-gray-500 mt-5">
                Կոդ չստացա՞ք{" "}
                <span className="font-semibold text-gray-900 cursor-pointer hover:underline">
                  Նորից ուղարկել
                </span>
              </p>
            </div>
          </div>
          </>
        ) : 
        (
          <>
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gray-900 
            rounded-2xl flex items-center justify-center
            mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Միանալ Echo-ին
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Ստեղծիր քո հաշիվը
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm
          border border-gray-200 p-8 w-full max-w-xl 
          flex flex-col">
            <div className="flex gap-5">
              <div className="flex flex-col w-full">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Անուն Ազգանուն
                  </label>
                  <input
                    type="text"
                    placeholder="Ձեր անուն ազգանունը"
                    value={formDetails.username}
                    onChange={(e) => setFormDetails({...formDetails, username: e.target.value})}
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Հեռախոսահամար
                  </label>
                  <input
                    type="text"
                    placeholder="(+374) .. .. .. .."
                    value={formDetails.phone}
                    onChange={(e) => setFormDetails({...formDetails, phone: e.target.value})}
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Էլ. փոստ
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formDetails.email}
                    onChange={(e) => setFormDetails({...formDetails, email: e.target.value})}
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Գաղտնաբառ
                  </label>
                  <input
                    type="password"
                    placeholder="Ստեղծիր գաղտնաբառ"
                    value={formDetails.password}
                    onChange={(e) => setFormDetails({...formDetails, password: e.target.value})}
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Գաղտնաբառ
              </label>
              <input
                type="password"
                placeholder="Հաստատել գաղտնաբառը"
                value={formDetails.confirmPass}
                onChange={(e) => setFormDetails({...formDetails, confirmPass: e.target.value})}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <button 
              className="w-full bg-gray-900 text-white 
              font-semibold py-3 rounded-xl
              hover:bg-gray-800 transition-colors 
              cursor-pointer" 
              onClick={registerUserFunc}>
              Գրանցվել
            </button>

            <p className="text-center text-sm text-gray-500 mt-5">
              Արդեն հաշիվ ունե՞ս։{" "}
              <span
                className="font-semibold text-gray-900 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Մուտք գործել
              </span>
            </p>
          </div>
        </>
        )
      }
    </div>
    <Toaster richColors/>
    </>
  );
}

export default Register;
