const ToggleIconButton = ({ isActive, onClick, ActiveIcon, InactiveIcon, iconClassName = 'text-white', disabled = false }) => {
  const IconComponent = isActive ? ActiveIcon : InactiveIcon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[50px] h-[50px] bg-[rgba(0,0,0,0.2)] rounded-[50px] transition duration-300 flex justify-center items-center ${!disabled && 'cursor-pointer'}`}
    >
      <IconComponent size={25} className={iconClassName} />
    </button>
  );
};

export default ToggleIconButton;