import loadingGif from '../assets/images/loading.gif';

function Loading() {

    return (
        <>
            <div className="flex-1">

                <div className='flex justify-center items-center h-screen ml-16 md:ml-0'>
                    <img src={loadingGif}/>
                </div>
                
            </div>
        </>
    )
}

export default Loading;