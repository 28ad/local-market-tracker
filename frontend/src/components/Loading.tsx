import loadingGif from '../assets/images/loading.gif';

function Loading() {

    return (
        <>
            <div className="flex-1">

                <div className='flex justify-center items-center h-screen'>
                    <img src={loadingGif}/>
                </div>
                
            </div>
        </>
    )
}

export default Loading;