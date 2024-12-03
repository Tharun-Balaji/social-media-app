
export default function CustomButton({title, containerStyles, iconRight,type,onClick}) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      className={`inline-flex items-center text-base ${containerStyles}`}

    >
      {title}
      {iconRight && <div className="ml-2">{ iconRight }</div> }
    </button>
  )
};


