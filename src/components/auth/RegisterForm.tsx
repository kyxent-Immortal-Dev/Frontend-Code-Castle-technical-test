import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { RegisterDataI } from "../../interfaces/auth/RegisterI";
import { useAuthService } from "../../store/useAuth.service";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterDataI>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "vendedor",
    },
  });

  const { register: registerUser, isLoading, error, clearError } = useAuthService();
  const password = watch("password");

  const onSubmit = async (data: RegisterDataI): Promise<void> => {
    try {
      clearError();
      await registerUser(data);
      navigate('/'); // Redirect to home after successful registration
    } catch (error) {
      // Error is already handled in the store
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      
    
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input 
            type="text" 
            id="name" 
            className="input input-bordered w-full"
            {...register("name", { 
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
              }
            })} 
          />
          {errors.name && (
            <p className="text-error text-sm">{errors.name.message}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input 
            type="email" 
            id="email" 
            className="input input-bordered w-full"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })} 
          />
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select 
            id="role" 
            className="select select-bordered w-full"
            {...register("role")}
          >
            <option value="vendedor">Vendedor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input 
            type="password" 
            id="password" 
            className="input input-bordered w-full"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            })} 
          />
          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="password_confirmation" className="text-sm font-medium">
            Confirm Password
          </label>
          <input 
            type="password" 
            id="password_confirmation" 
            className="input input-bordered w-full"
            {...register("password_confirmation", { 
              required: "Please confirm your password",
              validate: (value) => 
                value === password || "Passwords do not match"
            })} 
          />
          {errors.password_confirmation && (
            <p className="text-error text-sm">{errors.password_confirmation.message}</p>
          )}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="link link-primary">
              Login here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}; 