"use client"
import AuthService from "@/app/services/auth";
import { useState } from "react";
import toast from "react-hot-toast";


const ForgotPassword = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await AuthService.forgotPassword(email)
            toast.success(response.message);
        } catch (error) {
            let errorMessage = 'Diqka nuk shkoi mire, provoni perseri!';
            console.log(error,"error")
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
            setEmail('');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-lightGray text-center">
                   Keni harruar fjalekalimin?
                </h1>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-darkGray"
                        >
                        Email:
                        </label>
                        <input 
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-darkGray"
                            disabled={loading}
                            required />
                    </div>
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 text-white bg-lightGray rounded-md ${
                        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-darkGray"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Po pranohet..." : "Apliko"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;