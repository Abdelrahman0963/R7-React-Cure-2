import { Link } from "react-router"
import './error.css'
const Error: React.FC = () => {
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="relative overflow-hidden min-h-screen bg-white w-full text-white font-[Open_Sans] flex flex-col items-center justify-center">
        {/* السحاب */}
        <div id="clouds" className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="cloud x1"></div>
          <div className="cloud x1_5"></div>
          <div className="cloud x2"></div>
          <div className="cloud x3"></div>
          <div className="cloud x4"></div>
          <div className="cloud x5"></div>
        </div>

        {/* المحتوى */}
        <div className="relative z-10 text-center w-4/5 mx-auto mt-24">
          <div className="text-[220px] text-3xl text-[#145DB8] leading-none tracking-[15px] inline-block font-bold">
            404
          </div>
          <hr className="border-t-4 border-white w-[420px] mx-auto my-2 relative" />
          <div className="text-5xl tracking-[12px] text-[#145DB8] mt-4">THE PAGE</div>
          <div className="text-lg text-[#145DB8] mb-8">WAS NOT FOUND</div>
          <Link
            to="/"
            className="inline-block  bg-[#145DB8] text-2xl px-10 py-3 rounded-md font-semibold hover:bg-gray-100 transition-all"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Error
