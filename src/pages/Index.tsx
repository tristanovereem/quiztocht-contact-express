import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Vul alle velden in",
        description: "Alle velden zijn verplicht.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Create message object
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      message: formData.message,
      timestamp: new Date().toISOString(),
    };

    // Get existing messages
    const existingMessages = localStorage.getItem("quiztocht-messages");
    const messages: ContactMessage[] = existingMessages ? JSON.parse(existingMessages) : [];

    // Add new message
    messages.push(newMessage);
    localStorage.setItem("quiztocht-messages", JSON.stringify(messages));

    // Success feedback
    toast({
      title: "Bericht verzonden! ✓",
      description: "We nemen zo snel mogelijk contact met je op.",
    });

    // Reset form
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl">Stuur een Bericht</CardTitle>
            <CardDescription>
              Vul het formulier in en we komen zo snel mogelijk bij je terug.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Naam *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jouw naam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mailadres *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jouw@email.nl"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Bericht *</Label>
                <Textarea
                  id="message"
                  placeholder="Typ hier je bericht..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="mt-1 min-h-[150px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-hero hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Versturen..." : "Verstuur Bericht"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
