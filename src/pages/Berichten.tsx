import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

const Berichten = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const stored = localStorage.getItem("quiztocht-messages");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Sort by newest first
      parsed.sort((a: ContactMessage, b: ContactMessage) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setMessages(parsed);
    }
  };

  const deleteMessage = (id: string) => {
    const filtered = messages.filter((msg) => msg.id !== id);
    setMessages(filtered);
    localStorage.setItem("quiztocht-messages", JSON.stringify(filtered));
    toast({
      title: "Bericht verwijderd",
      description: "Het bericht is succesvol verwijderd.",
    });
  };

  const downloadAsJSON = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quiztocht-berichten-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download gestart",
      description: "Berichten worden gedownload als JSON.",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("nl-NL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Terug naar Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl">
              Q
            </div>
            <span className="text-2xl font-bold text-foreground">Quiztocht</span>
          </div>
        </div>
      </header>

      {/* Messages Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Ontvangen Berichten</h1>
              <p className="text-muted-foreground">
                {messages.length === 0
                  ? "Nog geen berichten ontvangen"
                  : `${messages.length} ${messages.length === 1 ? "bericht" : "berichten"}`}
              </p>
            </div>
            {messages.length > 0 && (
              <Button
                onClick={downloadAsJSON}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download JSON
              </Button>
            )}
          </div>

          {messages.length === 0 ? (
            <Card className="shadow-soft text-center py-12">
              <CardContent>
                <Mail className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Geen berichten</h3>
                <p className="text-muted-foreground mb-6">
                  Er zijn nog geen contactberichten ontvangen.
                </p>
                <Link to="/">
                  <Button className="bg-gradient-hero hover:opacity-90">
                    Naar Contactformulier
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <Card key={msg.id} className="shadow-soft hover:shadow-hover transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          {msg.name}
                          <Badge variant="secondary" className="text-xs font-normal">
                            Nieuw
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-primary hover:underline"
                          >
                            {msg.email}
                          </a>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(msg.timestamp)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMessage(msg.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-foreground whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Berichten;
