import ConstructionImg from '../assets/images/construction.png';
import Digging from '../assets/images/digging.gif';
import Logo from '../assets/images/logo.png';

function NotReady() {

    return (
        <>
            <div className="bg-gray-800 h-screen overflow-hidden">

                <header className="w-full border-b h-20 border-gray-400 flex justify-center items-center">
                    <img src={Logo} className="w-28 cursor-pointer" />
                </header>

                <div className='flex flex-col justify-center items-center h-full'>

                    <div className='flex flex-col items-center'>
                        <p className="text-5xl font-extrabold text-white text-center">PAGE IS CURRENTLY</p>
                        <img src={ConstructionImg} className=' w-80 md:w-96 mt-8' />
                        <img src={Digging} className='w-28 mt-2' />
                    </div>

                </div>

            </div>
        </>
    )
}

export default NotReady;