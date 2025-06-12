"use client"
import AuthService from "@/app/services/auth";
import { useState } from "react"
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { validatePassword } from "@/lib/utils";


const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [confirmationPassword, setConfirmationPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (passwordError || confirmPasswordError) {
                setLoading(false);
                return;
            }
            const response = await AuthService.resetPasswordByToken(token as string, password, confirmationPassword);
            if(response.message) {
                toast.success(response.message);
                router.push('/login');
                setPassword('');
                setConfirmationPassword('');
                setPasswordError('');
                setConfirmPasswordError('');
            }
        } catch (error: any) {
            console.log('Reset password error:', error);
            let errorMessage = 'Diqka nuk shkoi mire, provoni perseri!';
            
            if (error.response?.data?.message) {
                switch(error.response.data.message) {
                    case 'Passwords do not match':
                        errorMessage = 'Fjalekalimi dhe konfirmimi i fjalekalimit nuk jane te njejte';
                        break;
                    case 'Invalid or expired token':
                        errorMessage = 'Linku per ndryshimin e fjalekalimit ka skaduar';
                        break;
                    case 'Invalid reset attempt':
                    case 'Invalid reset token':
                        errorMessage = 'Linku per ndryshimin e fjalekalimit eshte i pavlefshem';
                        break;
                    default:
                        errorMessage = error.response.data.message;
                }
            }
            toast.error(error.message);
            setPassword('');
            setConfirmationPassword('');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-lightGray text-center">
                    Ndryshoni fjalekalimin
                </h1>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-darkGray"
                        >
                        Fjalekalimi i ri:
                        </label>
                        <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                const newPassword = e.target.value;
                                setPassword(newPassword);
                                const validation = validatePassword(newPassword);
                                setPasswordError(validation.error);
                                
                                if (confirmationPassword && newPassword !== confirmationPassword) {
                                    setConfirmPasswordError('Fjalekalimi dhe konfirmimi i fjalekalimit nuk jane te njejte');
                                } else {
                                    setConfirmPasswordError('');
                                }
                            }}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-darkGray"
                            disabled={loading}
                            required />
                        {passwordError && (
                            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="confirmationPassword"
                            className="block text-sm font-medium text-darkGray"
                        >
                        Konfirmimi i fjalekalimit:
                        </label>
                        <input 
                            type="password"
                            id="confirmationPassword"
                            value={confirmationPassword}
                            onChange={(e) => {
                                const newConfirmPassword = e.target.value;
                                setConfirmationPassword(newConfirmPassword);
                                if (newConfirmPassword !== password) {
                                    setConfirmPasswordError('Fjalekalimi dhe konfirmimi i fjalekalimit nuk jane te njejte');
                                } else {
                                    setConfirmPasswordError('');
                                }
                            }}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-darkGray"
                            disabled={loading}
                            required />
                        {confirmPasswordError && (
                            <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 text-white bg-lightGray rounded-md ${
                        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-darkGray"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Po ndryshohet..." : "Ndrysho Fjalekalimin"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword