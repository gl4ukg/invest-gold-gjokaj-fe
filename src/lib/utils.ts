import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const validatePassword = (password: string): { isValid: boolean; error: string } => {
	if (password.length < 8) {
		return { isValid: false, error: 'Fjalekalimi duhet te kete te pakten 8 karaktere' };
	}
	if (!/[A-Z]/.test(password)) {
		return { isValid: false, error: 'Fjalekalimi duhet te kete te pakten nje shkronje te madhe' };
	}
	if (!/[a-z]/.test(password)) {
		return { isValid: false, error: 'Fjalekalimi duhet te kete te pakten nje shkronje te vogel' };
	}
	if (!/[0-9]/.test(password)) {
		return { isValid: false, error: 'Fjalekalimi duhet te kete te pakten nje numer' };
	}
	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		return { isValid: false, error: 'Fjalekalimi duhet te kete te pakten nje karakter special (!@#$%^&*(),.?":{}|<>)' };
	}
	return { isValid: true, error: '' };
};