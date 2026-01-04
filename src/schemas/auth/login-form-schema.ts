import { z } from "zod";

export const loginFormSchema = z.object({
  // email: z
  //   .string()
  //   .trim()
  //   .nonempty("Email is required.")
  //   .transform((val) => {
  //     if (!val.includes("@")) {
  //       val = `${val}@norsu.edu.ph`;
  //     }
  //     return val;
  //   })
  //   .check(z.email("Invalid email address.").toLowerCase())
  //   .refine((val) => val.endsWith("@norsu.edu.ph"), {
  //     message: "Email must end with @norsu.edu.ph.",
  //   }),
  email: z.email(),
  password: z.string().trim().nonempty("Password is required."),
});

export type TLoginFormSchema = z.infer<typeof loginFormSchema>;
