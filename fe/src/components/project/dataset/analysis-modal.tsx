import { Button, Input, RadioGroup, Radio, ModalHeader, ModalBody, ModalFooter, } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface AnalysisModalProps {
  onClose: () => void;
  filterChecked: () => string[];
  projectId: number;
}

const AnalysisModal = ({ onClose, filterChecked, projectId }: AnalysisModalProps) => {
  const [selectedImagesId, setSelectedImagesId] = useState<string[]>([]);
  const [isBtnDisabled, setIsBtnDisaled] = useState(true);
  const [historyName, setHistoryName] = useState(`History_${new Date().toUTCString()}`)
  const [algorithm, setAlgorithm] = useState("tsne");
  const [isPrivate, setIsPrivate] = useState("open");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const preventClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };
  
  const analysis = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/be/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm: algorithm,
          project_id: projectId,
          user_id: 1,
          history_name: historyName,
          is_private: isPrivate !== "open",
          selected_tags: [
              ["string"],
              ["string"]
          ],
          image_ids: selectedImagesId
        })
      });
  
      if (response.ok) {
        console.log(response)
      } else {
        console.log(response)
      };
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedImagesId.length >= 10) {
      setIsBtnDisaled(false)
      setErrorMessage("")
    } else {
      setIsBtnDisaled(true)
      setErrorMessage("최소 10개 이상의 데이터를 선택해주세요.")
    }
  }, [selectedImagesId])

  useEffect(() => {
    setSelectedImagesId(filterChecked)
  }, [])

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Analysis</ModalHeader>
      <ModalBody>
        <div className="aspect-[1/1] flex flex-col" onClick={preventClick}>
          <div className="h-[90%] flex justify-between pb-[0.5rem]">
            <div className="w-[100%]">
              
              <div className="w-full h-[100%] mb-[5%]">
                <div className="flex flex-col h-[5rem] mb-[1rem]">
                  <div className="h-[1.5rem] my-auto">분석명</div>
                  <Input
                    classNames={{
                      input: "h-[2.5rem] min-h-0 flex-grow", // 직접적인 input 요소의 높이
                      inputWrapper: "h-[2.5rem] min-h-0 rounded-lg" // input을 감싸는 wrapper의 높이
                    }}
                    value={historyName}
                    onValueChange={setHistoryName}
                  />
                </div>

                <div className="flex mb-[1rem]">
                  <RadioGroup 
                    classNames={{label: "text-black"}} 
                    label="차원축소 알고리즘" 
                    orientation="horizontal"
                    value={algorithm}
                    onValueChange={setAlgorithm}
                  >
                    <Radio
                      classNames={{
                        wrapper: "bg-white group-data-[selected=true]:border-primary group-data-[hover-unselected=true]:bg-primary",
                        control: "bg-primary"
                      }}
                      value="tsne"
                    >
                      T-SNE
                    </Radio>
                    <Radio
                      classNames={{
                        wrapper: "bg-white group-data-[selected=true]:border-primary group-data-[hover-unselected=true]:bg-primary",
                        control: "bg-primary"
                      }}
                      value="umap"
                    >
                      UMAP
                    </Radio>
                  </RadioGroup>
                </div>

                <div className="flex mb-[1rem]">
                  <RadioGroup
                    classNames={{label: "text-black"}} 
                    label="공개여부" 
                    orientation="horizontal"
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                  >
                    <Radio 
                      classNames={{
                        wrapper: "bg-white group-data-[selected=true]:border-primary group-data-[hover-unselected=true]:bg-primary",
                        control: "bg-primary"
                      }}  
                      value="open"
                    >
                      공개
                    </Radio>
                    <Radio 
                      classNames={{
                        wrapper: "bg-white group-data-[selected=true]:border-primary group-data-[hover-unselected=true]:bg-primary",
                        control: "bg-primary"
                      }}  
                      value="private"
                    >
                      비공개
                    </Radio>
                  </RadioGroup>
                </div>

              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center">
        <div className="text-gray-500">{errorMessage}</div>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button color="primary" isDisabled={isBtnDisabled} isLoading={isLoading} onPress={analysis}>
          Analysis
        </Button>
      </ModalFooter>
    </>
  );
};

export default AnalysisModal;
