export const Spinner = () => {
  return (
    <div
      className="justify-center items-center h-full w-full fixed block top-0 left-0 bg-white opacity-75"
      style={{ zIndex: 999 }}
    >
      <span
        className="text-green-500 opacity-100 top-1/2 my-0 mx-auto block relative w-0 h-0"
        style={{ top: "50%" }}
      >
        <div className="animate-spin rounded-full h-10 w-10"></div>
      </span>
    </div>
  );
};
