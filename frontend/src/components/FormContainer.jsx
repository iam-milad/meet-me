const FormContainer = ({ children }) => {
    return (
      <div className="flex justify-center px-4 mt-36">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    );
  };
  
  export default FormContainer;
  