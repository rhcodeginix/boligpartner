export const ViewProductDetail: React.FC<{
  editData: any;
}> = ({ editData }) => {
  return (
    <>
      <div className="p-6 pt-0">
        <img
          src={editData?.Hovedbilde[0]}
          alt="configurator"
          className="w-full h-auto object-cover"
        />
        <p className="mt-6 text-secondary text-base">
          {editData?.Produktbeskrivelse}
        </p>
      </div>
    </>
  );
};
