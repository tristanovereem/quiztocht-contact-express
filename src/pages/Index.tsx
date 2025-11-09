import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl">
              Q
            </div>
            <span className="text-2xl font-bold text-foreground">Quiztocht</span>
          </div>
          <Link to="/berichten">
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Berichten
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Neem Contact Op
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Heb je een vraag of wil je meer weten over onze quiztochten?
            <br />
            Stuur ons een bericht en we helpen je graag verder!
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="shadow-soft hover:shadow-hover transition-shadow">
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

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">E-mail</h3>
                      <p className="text-muted-foreground">info@quiztocht.nl</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Telefoon</h3>
                      <p className="text-muted-foreground">+31 6 12 34 56 78</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Adres</h3>
                      <p className="text-muted-foreground">
                        Quiztocht BV
                        <br />
                        Groene Laan 123
                        <br />
                        1234 AB Amsterdam
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft bg-gradient-card border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">Openingstijden</h3>
                  <div className="space-y-1 text-muted-foreground">
                    <p>Ma - Vr: 09:00 - 18:00</p>
                    <p>Za - Zo: Gesloten</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Quiztocht. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
