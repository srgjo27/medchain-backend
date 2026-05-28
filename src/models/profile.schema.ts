import { z } from "zod";

export const updateProfileSchema = z.object({
  nama_lengkap: z.string().min(1, "Nama lengkap tidak boleh kosong").max(100).optional(),
  tanggal_lahir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir harus YYYY-MM-DD")
    .optional()
    .nullable(),
  golongan_darah: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional()
    .nullable(),
  alergi: z.array(z.string()).optional(),
  no_hp: z.string().max(20).optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
