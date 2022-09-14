import { useGContext } from "../GContext";

export const TopLevelModal = () => {
  const { modalData, setModalData } = useGContext();

  if (!modalData) return null;

  return (
    <div className="absolute w-screen h-screen flex justify-center items-center z-50">
      <div className="bg-[#026699] p-2 flex flex-col min-w-[200px] mx-4 rounded-md">
        <button
          onClick={() => setModalData(null)}
          className="text-2xl ml-auto px-2"
        >
          ×
        </button>
        <div className="m-4">
          <img
            src="https://media.giphy.com/media/3GBG7xejOXhH7MyQkn/giphy.gif"
            alt=""
            className="w-64 mx-auto"
          />
          <h1 className="text-white font-bold text-2xl">
            {modalData?.title || "Congrats!"}
          </h1>
          <p className="text-white mt-4">
            {modalData?.description || "You did it!"}
          </p>
        </div>
      </div>
    </div>
  );
};
