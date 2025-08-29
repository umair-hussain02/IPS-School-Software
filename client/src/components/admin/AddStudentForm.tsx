import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  studentFormSchema,
  type StudentFormSchema,
} from "@/validations/studentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { getAllClasses } from "@/features/sClass/classSlice";
import { useEffect } from "react";

function AddStudentForm() {
  const dispatch = useAppDispatch();
  const { classes, loading, error } = useAppSelector((state) => state.class);

  useEffect(() => {
    dispatch(getAllClasses());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormSchema>({
    resolver: zodResolver(studentFormSchema),
  });

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  const onSubmit = (data: StudentFormSchema) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="shadow-xl rounded-2xl w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Add New Student
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 fullName">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                {...register("fullName", { required: "UserId is required" })}
                id="fullName"
                type="text"
                placeholder="Enter Student Name"
                required
              />
              {errors.fullName && (
                <p className="text-red-500">
                  {errors.fullName.message || "error"}
                </p>
              )}
            </div>

            <div className="space-y-2 phoneNumber">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                {...register("phoneNumber", {
                  required: "Phone Number is required",
                })}
                id="phoneNumber"
                type="text"
                placeholder="Enter Phone Number"
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2 dob">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                {...register("dob", { required: "Date of Birth is required" })}
                id="dob"
                type="date"
                placeholder="Enter Date of Birth"
                required
              />
              {errors.dob && (
                <p className="text-red-500">{errors.dob.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                {...register("gender", { required: "Gender is required" })}
                id="gender"
                className="border rounded px-3 py-2 w-full"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2 profilePicture">
              <Label htmlFor="profile">Profile Image</Label>
              <Input
                {...register("profilePicture", {})}
                id="profile"
                type="file"
                placeholder="Upload Profile Image"
                required
              />
              {errors.profilePicture && (
                <p className="text-red-500">
                  {errors.profilePicture.message?.toString()}
                </p>
              )}
            </div>
            <div className="space-y-2 address">
              <Label htmlFor="address">Address</Label>
              <Textarea
                {...register("address", { required: "Address is required" })}
                id="address"
                placeholder="Enter Address"
                required
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-2 guardianName">
              <Label htmlFor="guardianName">Guardian Name</Label>
              <Input
                {...register("guardianName", {
                  required: "Guardian Name is required",
                })}
                id="guardianName"
                type="text"
                placeholder="Enter Guardian Name"
                required
              />
              {errors.guardianName && (
                <p className="text-red-500">{errors.guardianName.message}</p>
              )}
            </div>
            <div className="space-y-2 guardianRelation">
              <Label htmlFor="guardianRelation">Guardian Relation</Label>
              <Input
                {...register("guardianRelation", {
                  required: "Guardian Relation is required",
                })}
                id="guardianRelation"
                type="text"
                placeholder="Enter Guardian Relation"
                required
              />
              {errors.guardianRelation && (
                <p className="text-red-500">
                  {errors.guardianRelation.message}
                </p>
              )}
            </div>
            <div className="space-y-2 class">
              <Label htmlFor="className">Class</Label>
              <select
                {...register("className", { required: "Class is required" })}
                id="class"
                className="border rounded px-3 py-2 w-full"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select Class
                </option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {`${cls.className} - ${cls.section}`}
                  </option>
                ))}
              </select>
              {errors.className && (
                <p className="text-red-500">{errors.className.message}</p>
              )}
            </div>
            <div className="space-y-2 rollNumber">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                {...register("rollNumber", {
                  required: "Roll Number is required",
                })}
                id="rollNumber"
                type="text"
                placeholder="Enter Roll Number"
                required
              />
              {errors.rollNumber && (
                <p className="text-red-500">{errors.rollNumber.message}</p>
              )}
            </div>
            <Button
              variant={"default"}
              type="submit"
              className="w-full rounded-xl"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddStudentForm;
