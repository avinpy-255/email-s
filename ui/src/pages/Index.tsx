import ZipperApp from "@/components/ZipperApp";
import StarsBackground from "@/components/StarsBackground";
import '../fonts/Martabak.ttf'

const Index = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 bg-black relative">
      <StarsBackground />
      <ZipperApp />
    </div>
  );
};

export default Index;
