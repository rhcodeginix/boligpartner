const Drawer = ({ isOpen, onClose, children }: any) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "show" : ""}`}
        style={{
          zIndex: isOpen ? 99999999 : 1,
        }}
        onClick={onClose}
      ></div>

      {/* Drawer content */}
      <div
        className={`drawer relative ${isOpen ? "open" : ""}`}
        style={{
          zIndex: isOpen ? 99999999 : 1,
        }}
      >
        {children}
      </div>
    </>
  );
};
export default Drawer;
