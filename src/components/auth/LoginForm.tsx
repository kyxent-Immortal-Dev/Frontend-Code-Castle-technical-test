import { useForm } from "react-hook-form";
import type { LoginFormData } from "../../interfaces/auth/LoginI";
import { useAuthService } from "../../store/useAuth.service";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useAuthService();

  const onSubmit = (data: LoginFormData): void => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
};
