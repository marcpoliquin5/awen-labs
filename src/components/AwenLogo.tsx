import logo from "@/assets/logo.avif";

interface AwenLogoProps {
  className?: string;
}

const AwenLogo = ({ className = "w-10 h-10" }: AwenLogoProps) => {
  return (
    <img
      src={logo}
      alt="AWEN Logo"
      className={`${className} brightness-0 invert`}
    />
  );
};

export default AwenLogo;
