// components/GoogleCalendarButton.jsx
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const GoogleCalendarButton = ({ user, onConnect }) => {
  const { token } = useAuth();

  const connectGoogleCalendar = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/google/auth-url`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        // Open auth URL in a popup window
        const popup = window.open(data.url, '_blank', 'width=600,height=600');
        
        // Polling to check when the popup closes
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            onConnect(); // Refresh connection status
          }
        }, 500);
      } else {
        toast.error("Failed to connect Google Calendar");
      }
    } catch (error) {
      toast.error("Error connecting Google Calendar");
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={connectGoogleCalendar}
      className="gap-2"
    >
      <CalendarPlus className="w-4 h-4" />
      {user.googleCalendarId ? "Reconnect Google" : "Connect Google Calendar"}
    </Button>
  );
};

export default GoogleCalendarButton;