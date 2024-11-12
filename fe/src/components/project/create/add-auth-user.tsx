import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { SearchUserType } from "@/types/projectType";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUsers } from "@/app/actions/user";
import { addUser } from "@/store/create-store";

interface AddAuthUserProps {
  isOpen: boolean; // 모달 열린 상태인가?
  onClose: () => void; // 모달 닫는 함수
}

const AddAuthUser = ({ isOpen, onClose }: AddAuthUserProps) => {
  const [isLoading, setIsLoading] = useState(false); // 로딩 중인가?
  const [nowPgae, setNowPage] = useState(1); // 현재 페이지
  const [totalPage, setTotalPage] = useState(1); // 총 페이지
  const [pageUsers, setPageUsers] = useState<SearchUserType[]>([]); // 현재 페이지의 유저 목록
  const [searchText, setSearchText] = useState(""); // 검색어
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지
  const [willselectedUser, setWillSelectedUser] = useState<SearchUserType[]>(
    []
  ); // 추가할 선택된 유저 목록
  const selectedUsers = useSelector(
    (state: RootState) => state.project.accesscontrol.users
  ); // 선택된 유저 목록

  const dispatch = useDispatch<AppDispatch>(); // redux dispatch

  const fetchUsers = useCallback(
    async (pageNumber: number, searchName?: string) => {
      // 서버에서 유저 목록을 가져오는 함수
      const result = await getUsers(pageNumber, searchName);
      if (!result.data || !result.data.data) {
        setErrorMessage("유저 목록을 가져오는데 실패했습니다.");
        setPageUsers([]);
      } else {
        setTotalPage(result.data.data.total_pages);
        setPageUsers(result.data.data.data);
      }
    },
    []
  );

  const handleSelectUser = (user: SearchUserType) => {
    // 유저를 선택하는 함수
    if (willselectedUser.includes(user)) {
      setWillSelectedUser(willselectedUser.filter((u) => u !== user));
    } else {
      setWillSelectedUser([...willselectedUser, user]);
    }
  };

  const handleAddUser = () => {
    // 선택된 유저를 추가하는 함수
    willselectedUser.forEach((user) => {
      dispatch(
        addUser({
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          Auth: "ReadOnly",
        })
      );
    });

    onClose();
  };

  useEffect(() => {
    setIsLoading(true);
    if (isOpen) {
      // 모달이 열리면 초기화
      setNowPage(1);
      setTotalPage(1);
      setPageUsers([]);
      setSearchText("");

      // 서버에서 유저 목록을 가져옴
      fetchUsers(1, searchText).finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  // 페이지 변경을 감지하는 새로운 useEffect
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchUsers(nowPgae, searchText).finally(() => {
        setIsLoading(false);
      });
    }
  }, [nowPgae, fetchUsers]);

  return (
    <Modal
      className="w-[90%] min-w-[600px] max-h-[610px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent className="w-full">
        <ModalHeader className="flex flex-col">
          <h2 className="text-xl font-bold">추가할 인원을 넣어주세요</h2>
          <p> {willselectedUser.length}명 이 선택됨</p>
        </ModalHeader>
        <ModalBody className="w-full flex flex-col items-center">
          <div className="flex flex-row justify-between gap-2">
            <Input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchText}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsLoading(true);
                  fetchUsers(1, searchText).finally(() => setIsLoading(false));
                }
              }}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              onClick={() => {
                setIsLoading(true);
                fetchUsers(1, searchText).finally(() => setIsLoading(false));
              }}
            >
              검색
            </Button>
          </div>
          <Table
            selectionMode="none"
            aria-label="사용자 목록"
            classNames={{
              base: "min-w-[400px] h-[300px] ",
            }}
          >
            <TableHeader>
              <TableColumn>이름</TableColumn>
              <TableColumn>이메일</TableColumn>
              <TableColumn>선택</TableColumn>
            </TableHeader>

            <TableBody
              isLoading={isLoading}
              loadingContent={
                <div className="w-full h-full flex flex-row justify-center items-center bg-slate-600 opacity-50">
                  <Spinner size="lg" />
                </div>
              }
              emptyContent={
                <div>
                  {errorMessage ? (
                    <div>{errorMessage}</div>
                  ) : (
                    <div>데이터가 없습니다.</div>
                  )}
                </div>
              }
            >
              {pageUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        handleSelectUser(user);
                      }}
                      size="sm"
                      disabled={!!selectedUsers[user.user_id]}
                      color={
                        willselectedUser.includes(user)
                          ? "secondary"
                          : "primary"
                      }
                    >
                      {!!selectedUsers[user.user_id]
                        ? "추가됨"
                        : willselectedUser.includes(user)
                        ? "목록 제거"
                        : "목록 추가"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            isDisabled={isLoading || errorMessage !== ""}
            onChange={setNowPage}
            showControls
            total={totalPage}
            initialPage={nowPgae}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            취소
          </Button>
          <Button
            onClick={() => {
              handleAddUser();
            }}
            disabled={
              willselectedUser.length === 0 || errorMessage !== "" || isLoading
            }
            color="primary"
          >
            반영
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAuthUser;
