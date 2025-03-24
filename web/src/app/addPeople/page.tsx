import Image from "next/image";
import { Frijole } from "next/font/google";
import SearchIcon from '@mui/icons-material/Search';

const frijole = Frijole({ weight: "400", subsets: ["latin"] });

export default function AddPeople() {
  return (
    <div className="relative w-full h-screen flex justify-end ">
      <Image
        src="/img5.png"
        layout="fill"
        objectFit="cover"
        alt="Background Image"
        className="opacity-60"
      />

    <div className="absolute flex flex-col text-center items-center space-y-4 px-48">
        <h1 className={`${frijole.className} text-4xl text-blue-800  pt-32`}>
        YOU CAN ADD <br/> UPTO FIVE PEOPLE
        </h1>
        <div className="flex space-x-4">
            <div className="flex bg-black rounded-lg">
                <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-gray-200 py-3 px-4 rounded-lg outline-none placeholder-gray-200"
                />
                <button className="bg-black text-gray-200 py-3 px-4 rounded-lg hover:text-gray-400 hover:cursor-pointer">
                <SearchIcon />
                </button>
            </div>

            <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600 hover:cursor-pointer">
                Add
            </button>
        </div>


      </div>
      <div className="">

      </div>
    </div>
  );
}
