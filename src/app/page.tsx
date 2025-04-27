"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  AnalyzeSentimentOutput,
  analyzeSentiment,
} from "@/ai/flows/analyze-sentiment";
import {
  GenerateSuggestionsOutput,
  generateSuggestions,
} from "@/ai/flows/generate-suggestions";
import {
  EnhanceBotInteractionOutput,
  enhanceBotInteraction,
} from "@/ai/flows/enhance-bot-interaction";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const defaultAvatar = "https://raw.githubusercontent.com/firebase/firebase-studio/main/assets/studio-icon-128.png";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [sentiment, setSentiment] = useState<AnalyzeSentimentOutput | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<
    GenerateSuggestionsOutput | null
  >(null);
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      // 1. Analyze Sentiment
      const sentimentAnalysis = await analyzeSentiment({ text: input });
      setSentiment(sentimentAnalysis);

      // 2. Generate Suggestions
      const suggestionGeneration = await generateSuggestions({
        userInput: input,
        sentiment: sentimentAnalysis.sentiment,
      });
      setSuggestions(suggestionGeneration);

      // 3. Enhance Bot Interaction
      const botInteraction = await enhanceBotInteraction({
        userInput: input,
        chatHistory: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      //delay before setMessages
      await new Promise((resolve) => setTimeout(resolve, 500));

      const botMessage: ChatMessage = {
        role: "bot",
        content: botInteraction.botResponse,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("Error processing message:", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-warm-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-black text-white p-6 rounded-b-lg shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 animate-pulse flex items-center">
        <Avatar className="mr-2 h-6 w-6">
                      <AvatarImage src={defaultAvatar} alt="Bot Avatar" />
                      <AvatarFallback>Bot</AvatarFallback>
                    </Avatar>Serene
        </h1>
      </div>

      {/* Banner Section */}
      <div
        className={cn(
          "bg-gradient-to-r from-gray-800 to-black text-white p-8 rounded-md shadow-lg m-4 transition-all duration-500 flex flex-col items-center justify-center",
          messages.length > 0 ? "transform scale-95 opacity-70" : ""
        )}
      >
        <h2 className="text-2xl font-bold mb-4 animate-fadeIn text-center">
          Welcome to Serene
        </h2>
        <p className="text-lg animate-fadeIn text-center">
          Your personal sentiment tracker and AI-powered assistant.
        </p>
        <ul className="list-disc pl-5 mt-4 animate-fadeInUp text-center">
          <li>Understand your emotions with sentiment analysis</li>
          <li>Get personalized suggestions to improve your well-being</li>
          <li>Enjoy a supportive and intelligent chatbot experience</li>
        </ul>
      </div>

      <main className="flex flex-col flex-grow p-4 space-y-4">
        <Card className="flex-grow overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea
              ref={chatHistoryRef}
              className="h-full w-full p-4 space-y-4"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "bot" && (
                    <Avatar>
                      <AvatarImage src={defaultAvatar} alt="Bot Avatar" />
                      <AvatarFallback>Bot</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col rounded-md p-3 shadow-md w-3/4">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex items-center gap-2 animate-pulse">
                  <Avatar>
                    <AvatarImage src={defaultAvatar} alt="Bot Avatar" />
                    <AvatarFallback>Bot</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {sentiment && (
          <Card className="animate-fadeIn">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">
                Sentiment Analysis
              </h3>
              <p>
                <strong>Sentiment:</strong>{" "}
                <Badge variant={sentiment.sentiment === 'positive' ? 'positive' : 'secondary'}>{sentiment.sentiment}</Badge>
              </p>
              <p>
                <strong>Score:</strong> {sentiment.score.toFixed(2)}
              </p>
              <p>
                <strong>Reason:</strong> {sentiment.reason}
              </p>
            </CardContent>
          </Card>
        )}

        {suggestions && (
          <Card className="animate-fadeIn">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
              {suggestions.suggestions.length > 0 ? (
                suggestions.suggestions.map((suggestion, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm">{suggestion.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Relevance: {(suggestion.relevanceScore * 100).toFixed(0)}%
                    </p>
                    {index < suggestions.suggestions.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))
              ) : (
                <p>No suggestions available for this sentiment.</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Enter your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
          />
          <Button onClick={handleSendMessage} disabled={isThinking}>
            {isThinking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </main>
      <Toaster />
    </div>
  );
}


