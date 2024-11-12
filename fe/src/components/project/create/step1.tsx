import React, { useEffect, useState } from "react";
import SelectCard from "./select-card";

import { StepProps } from "@/types/projectType";
import { AutocompleteItem, Autocomplete, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { getModels } from "@/app/actions/model";
import { ModelListResponseType } from "@/types/modelType";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setProjectModelName } from "@/store/create-store";

const cards: {
  imgUrl: string;
  title: string;
  description: string;
  value: string;
}[] = [
  {
    imgUrl: "/images/object-detection.png",
    title: "Object Detection",
    description: "Idenify objecdts and their positions with bounding boxes",
    value: "dts",
  },
  {
    imgUrl: "/images/classification.png",
    title: "Image Classification",
    description: "Assign Labels to the entire Image",
    value: "cls",
  },
];

const Step1 = ({ handleMove }: StepProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const project_model_name = useSelector(
    (state: RootState) => state.project.project_model_name
  );
  // 마운트 여부를 확인하는 변수를 추가하고 useEffect를 사용하여 마운트 여부를 설정
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // 모델 목록을 가져오는 API를 호출하고 상태를 설정합니다
  const [model_list, setModelList] = useState<ModelListResponseType | null>(
    null
  );

  // 마운트된 상태에서 선택이 바뀌면 모델 선택도 바뀌게 합니다
  useEffect(() => {
    dispatch(setProjectModelName(""));
  }, [category]);

  useEffect(() => {
    if (isMounted) {
      // 모델 리스트를 가져오는 API를 호출합니다
      getModels().then((data) => {
        if (!data.data) {
          console.error("모델 리스트 가져오기 에러", data.error);
        } else {
          setModelList(data.data);
        }
      });
    }
  }, [isMounted]);

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 w-full max-w-4xl lg:mx-auto p-4 min-h-[900px] lg:min-h-[400px]">
        {cards.map((card) => (
          <SelectCard
            selected={category === card.value}
            key={card.title}
            imgUrl={card.imgUrl}
            title={card.title}
            description={card.description}
            onClick={() => {
              if (setCategory) {
                console.log("category", card.value);
                setCategory(card.value);
                console.log("category", setCategory);
                console.log("category", category);
              }
            }}
          />
        ))}
      </div>
      {category && model_list && (
        <div className="w-full flex flex-col">
          <p className="text-[22px] font-bold text-center mb-3">
            관련된 모델을 선택해 주세요
          </p>
          <Autocomplete
            required
            onSelectionChange={(key) => {
              if (typeof key === "string") {
                dispatch(setProjectModelName(key));
              }
            }}
            size="lg"
          >
            {
              // 모델 리스트를 AutocompleteItem으로 변환하여 렌더링합니다
              model_list[category].map((model) => (
                <AutocompleteItem key={model} value={model}>
                  {model}
                </AutocompleteItem>
              ))
            }
          </Autocomplete>
        </div>
      )}
      <footer className="w-full mt-5 flex flex-row justify-between">
        <Button
          onClick={() => router.push("/project")}
          color="primary"
          variant="ghost"
        >
          나가기
        </Button>
        <Button
          onClick={() => handleMove(2)}
          disabled={project_model_name === "" || !category}
          color="primary"
          variant="ghost"
        >
          이후
        </Button>
      </footer>
    </div>
  );
};

export default React.memo(Step1);
