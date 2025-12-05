import VaccinesIcon from '@mui/icons-material/Vaccines';

const FooterComponent = () => {
  return (
    <footer className="z-10 w-full py-4 dark:bg-[#061406]">
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex justify-center items-center gap-4">
          <VaccinesIcon />
          <span>Pharmacy inc.</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
