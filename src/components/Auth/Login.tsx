import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { API } from "../../config/api";
import { setUser } from "../../store/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toastSettings = {
    position: "top-center",
    closeButton: true,
    duration: 2000
  }

  const loginFunc = async() => {
    if(!email || !password) {
      toast.error("Խնդրում ենք լրացնել բոլոր տվյալները", toastSettings as object);
      return;
    };
    try {
      const response = await axios.post(API.loginUrl, {
        email,
        password
      });

      if(response.data) {
        localStorage.setItem("accessToken", response?.data?.accessToken);
        dispatch(setUser(response?.data?.user));

        navigate('/')
      } else {
        return;
      }

    } catch(err: any) {
      toast.error(err.response?.data?.message, toastSettings as object);
    } 
  };
  
  return (
    <>
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
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
        <h1 className="text-2xl font-bold text-gray-900">Բարի գալուստ VinTab</h1>
        <p className="text-gray-500 text-sm mt-1">
          Մուտք գործիր շարունակելու համար
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Էլ. փոստ
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Գաղտնաբառ
          </label>
          <input
            type="password"
            placeholder="Մուտքագրիր գաղտնաբառ"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <button 
          className="w-full bg-gray-900 text-white font-semibold 
          py-3 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
          onClick={loginFunc}>
          Մուտք գործել
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Հաշիվ չունե՞ս։{" "}
          <span
            className="font-semibold text-gray-900 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Գրանցվել
          </span>
        </p>
      </div>
    </div>
    <Toaster richColors/>
    </>
  );
}

export default Login;
