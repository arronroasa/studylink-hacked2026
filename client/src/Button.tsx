// import logo from './assets/react.svg';

interface ButtonData {
    text: string;
    icon : string;
    reference ?: string;
}

function Button({text, icon, reference = "index.html"} : ButtonData) {
    return (
        <a className="flex flex-col items-center justify-center bg-green-850 w-full
        hover:bg-green-900 
        transition-colors duration-300" 
        href={reference}
        >
            <img src={icon} alt="Uh Oh!" className="w-8 h-8 pt-2"/>
            <span className="text-[14px] text-white pb-1">
                {text}
            </span>
        </a>
    )
}

export default Button