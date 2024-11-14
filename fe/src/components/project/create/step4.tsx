import { RootState } from "@/store/store";
import { StepProps } from "@/types/projectType";
import { CreateProjectRequestType } from "@/types/projectType";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ButtonFooter from "./buttonFooter";
import { customFetch } from "@/app/actions/customFetch";
import { useRouter } from "next/navigation";

const Step4 = ({ handleMove }: StepProps) => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/project");
  }, [router]);

  const project_name = useSelector(
    (state: RootState) => state.project.project_name
  );
  const project_model_task = useSelector(
    (state: RootState) => state.project.project_model_task
  );
  const project_model_name = useSelector(
    (state: RootState) => state.project.project_model_name
  );
  const description = useSelector(
    (state: RootState) => state.project.description
  );
  const is_private = useSelector(
    (state: RootState) => state.project.is_private
  );
  const addedAuthUsers = useSelector(
    (state: RootState) => state.project.accesscontrol.users
  );
  const addedAuthDeps = useSelector(
    (state: RootState) => state.project.accesscontrol.departments
  );

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const requesetCreateProject = async () => {
    if (isLoading) return; // 이미 로딩 중이면 실행하지 않음

    try {
      console.log("request create project");
      setIsLoading(true);
      setErrorMessage("");

      const sendData: CreateProjectRequestType = {
        project_name: project_name,
        project_model_task: project_model_task,
        project_model_name: project_model_name,
        description: description,
        accesscontrol: {
          view_users: Object.values(addedAuthUsers)
            .filter((user) => user.Auth === "ReadOnly")
            .map((user) => user.user_id.toString()),
          edit_users: Object.values(addedAuthUsers)
            .filter((user) => user.Auth === "Read&Write")
            .map((user) => user.user_id.toString()),
          view_departments: Object.values(addedAuthDeps)
            .filter((dep) => dep.Auth === "ReadOnly")
            .map((dep) => dep.department_name),
          edit_departments: Object.values(addedAuthDeps)
            .filter((dep) => dep.Auth === "Read&Write")
            .map((dep) => dep.department_name),
        },
        is_private: is_private,
      };

      const response = await customFetch<string>({
        endpoint: "/project/create",
        method: "POST",
        body: JSON.stringify(sendData),
      });
      if (!response.data) {
        console.error(response);
        setErrorMessage("프로젝트 생성에 실패했습니다.");
      } else {
        router.push("/project");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("프로젝트 생성에 실패했습니다.");
      setIsLoading(false);
    }
  };

  const [selected, setSelected] = useState<string>("User");

  return (
    <div className="max-w-[700px] w-full flex flex-col items-center justify-center">
      <header>
        <h1 className="text-[20px] mb-3">종합적인 프로젝트 정보</h1>
      </header>
      <section className="gap-2 grid grid-cols-1 md:grid-cols-2">
        <Card className="w-[40%] min-w-[300px]">
          <CardHeader>프로젝트 이름</CardHeader>
          <CardBody>
            <p>{project_name}</p>
          </CardBody>
        </Card>
        <Card className="w-[40%] min-w-[300px]">
          <CardHeader>프로젝트 모델값</CardHeader>
          <CardBody>
            <p>{project_model_name}</p>
          </CardBody>
        </Card>
        <Card className="w-[40%] min-w-[300px]">
          <CardHeader>프로젝트 설명</CardHeader>
          <CardBody>
            <p>{description}</p>
          </CardBody>
        </Card>
        <Card className="w-[40%] min-w-[300px]">
          <CardHeader>프로젝트 Private여부</CardHeader>
          <CardBody>
            <p>{is_private ? "Private" : "Public"}</p>
          </CardBody>
        </Card>
      </section>
      {is_private && (
        <section className="w-full flex flex-col">
          <Tabs
            aria-label="private allow tabs"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key.toString())}
          >
            <Tab key="User" title="User">
              <Table
                aria-label="seleced user list"
                classNames={{
                  base: "min-w-[400px] h-[300px] ",
                }}
              >
                <TableHeader>
                  <TableColumn>유저 이름</TableColumn>
                  <TableColumn>이메일</TableColumn>
                  <TableColumn>권한</TableColumn>
                </TableHeader>

                <TableBody emptyContent="등록된 사람이 없습니다.">
                  {Object.values(addedAuthUsers).map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.Auth}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>
            <Tab key="Department" title="Department">
              <Table
                aria-label="seleced department list"
                classNames={{
                  base: "min-w-[400px] h-[300px] ",
                }}
              >
                <TableHeader>
                  <TableColumn>부서이름</TableColumn>
                  <TableColumn>권한</TableColumn>
                </TableHeader>

                <TableBody emptyContent="등록된 부서가 없습니다.">
                  {Object.values(addedAuthDeps).map((department) => (
                    <TableRow key={department.department_id}>
                      <TableCell>{department.department_name}</TableCell>
                      <TableCell>{department.Auth}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>
          </Tabs>
        </section>
      )}
      {errorMessage !== "" && <p className="text-red-500">{errorMessage}</p>}
      <footer className="w-full mt-5 flex flex-row justify-between">
        <Button onClick={() => handleMove(3)} color="primary" variant="ghost">
          이전
        </Button>
        <Button
          onClick={() => {
            requesetCreateProject();
          }}
          color="primary"
          variant="ghost"
          disabled={isLoading}
        >
          {isLoading ? "로딩중..." : "프로젝트 생성"}
        </Button>
      </footer>
    </div>
  );
};

export default Step4;
