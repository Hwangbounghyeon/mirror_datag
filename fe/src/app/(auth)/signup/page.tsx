import SignForm from "@/components/auth/signupForm";
import { DepartmentType } from "@/types/departmentType";
import { getDepartments } from "@/lib/constants/department";

export default async function Page() {
  const department_list: DepartmentType[] = await getDepartments();

  return <SignForm department_list={department_list} />;
}
