interface Props {
    onClick: () => void;
    label: string;
}

function FormButton({label, onClick}: Props) {

    return (
        <>
            <button 
            onClick={onClick}
            className="py-2 px-8 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-sm">{label}</button>
        </>
    )
}

export default FormButton;