import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface ProButtonProps {
  className?: string;
}

const ProButton = ({ className }: ProButtonProps) => {
  const handleProClick = () => {
    toast.success("Upgrade to Pro for 100MB storage limit!", {
      description: "Coming soon...",
      action: {
        label: "Learn More",
        onClick: () => console.log("Directed to pro features")
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleProClick}
      className={`bg-gradient-to-r from-red-400 to-blue-500 border-none text-black font-semibold px-3 py-1 h-auto rounded-full shadow-glow-orange hover:shadow-glow-orange-lg transition-all hover:-translate-y-0.5 ${className}`}
    >
      PRO
    </Button>
  );
};

export default ProButton;
