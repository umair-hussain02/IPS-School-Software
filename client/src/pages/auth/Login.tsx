import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { LoginCredentials } from "@/types/auth.type";
import { useForm, type SubmitHandler } from "react-hook-form";
import { login } from "./authSlice";
import { useAppDispatch } from "@/hooks/hook";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    try {
      const resultAction = await dispatch(login(data));
      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload?.data;
        console.log("Login successful:", resultAction.payload);
        console.log("User role:", user);

        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "teacher") {
          navigate("/teacher");
        } else if (user.role === "student") {
          navigate("/student");
        } else {
          navigate("/"); // fallback
        }
      } else {
        console.log("Login failed:", resultAction.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="shadow-xl rounded-2xl w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            School Management System
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                {...register("id", { required: "UserId is required" })}
                id="email"
                type="text"
                placeholder="Enter your email or username"
                required
              />
              {errors.id && <p className="text-red-500">{errors.id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password", { required: "Password is required" })}
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              variant={"outline"}
              type="submit"
              className="w-full rounded-xl"
            >
              Login
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <a
              href="#"
              className={cn("hover:underline text-primary font-medium")}
            >
              Forgot Password?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
