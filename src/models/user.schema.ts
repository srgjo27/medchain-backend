import { z } from "zod";

export const registerSchema = z.object({
  nama_lengkap: z.string().min(1, "Nama lengkap harus diisi").max(100),
  email: z.string().email("Format email tidak valid").max(255),
  nik: z.string().length(16, "NIK harus tepat 16 karakter"),
  password: z.string().min(8, "Password minimal harus 8 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token tidak boleh kosong"),
  newPassword: z.string().min(8, "Password baru minimal harus 8 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
