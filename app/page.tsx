"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Coffee, Camera, Utensils, Clock } from "lucide-react";
import confetti from "canvas-confetti";
import ThemedCard from "@/components/ThemedCard";
import Sparkles from "@/components/Sparkles";
import FloatingOrbs from "@/components/FloatingOrbs";
import FairyFooter from "@/components/FairyFooter";
import StepCard from "@/components/StepCard";

interface Answers {
  isAvailable: boolean | null;
  date: Date | null;
  time: string;
  restaurantName: string;
  restaurantAddress: string;
  food: string[];
  photoBook: string;
  photoBookAddress: string;
  excitement: number;
}


const HeartBackground = dynamic(() => import("@/components/HeartBackground"), {
  ssr: false,
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 },
};

export default function EnchantingDateProposalApp() {
  const [step, setStep] = useState(0);
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [answers, setAnswers] = useState<Answers>({
    isAvailable: null,
    date: new Date(2026, 5, 29),
    time: "7:30 PM",
    restaurantName: "",
    restaurantAddress: "",
    food: [],
    photoBook: "",
    photoBookAddress: "",
    excitement: 50,
  });

  const [hour, setHour] = useState<string>("7");
  const [minute, setMinute] = useState<string>("30");
  const [ampm, setAmpm] = useState<string>("PM");
  const [isCustomPhotoBook, setIsCustomPhotoBook] = useState(false);
  const [customPhotoBookName, setCustomPhotoBookName] = useState("");
  const [customPhotoBookAddress, setCustomPhotoBookAddress] = useState("");

  useEffect(() => {
    setAnswers((prev) => ({ ...prev, time: `${hour}:${minute} ${ampm}` }));
  }, [hour, minute, ampm]);

  const handleAnswer = (key: keyof Answers, value: Answers[keyof Answers]) => {
    setAnswers({ ...answers, [key]: value });
    setStep(step + 1);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    try {
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return d.toDateString();
    }
  };

  const photoBookPlaces = [
    { name: "Photo Snap", address: "91 Le Hong Phong" },
    { name: "Photo Time", address: "45 Nguyen Thi Dinh" },
    { name: "Photo Star", address: "91 Chuong Duong" },
    { name: "A Little Quy Nhon", address: "67 Thanh Nien" },
  ];
  const restaurantAddress = "33 Le Hong Phong";
  const restaurantName = "Chum Irori";
  const restaurantMenu = [
    { name: "SÚP BÍ ĐỎ", icon: <Utensils className="w-6 h-6" /> },
    { name: "SALAD BA RỌI XÔNG KHÓI", icon: <Utensils className="w-6 h-6" /> },
    { name: "KHOAI TÂY BƠ SỐT TIÊU ĐEN", icon: <Utensils className="w-6 h-6" /> },
    { name: "MỲ Ý PESTO BÒ MỸ", icon: <Utensils className="w-6 h-6" /> },
    { name: "TÔM SỐT VANG", icon: <Coffee className="w-6 h-6" /> },
  ];

  const moveNoButton = () => {
    const randomX = Math.floor(Math.random() * 181) - 90;
    const randomY = Math.floor(Math.random() * 121) - 60;
    setNoButtonOffset({ x: randomX, y: randomY });
  };

  const handleNoHover = () => {
    if (noHoverCount >= 3) return;

    const nextCount = noHoverCount + 1;
    setNoHoverCount(nextCount);

    if (nextCount >= 3) {
      setNoButtonOffset({ x: 0, y: 0 });
      return;
    }

    moveNoButton();
  };

  const handleNoClick = () => {
    if (noHoverCount >= 3) {
      handleAnswer("isAvailable", true);
      triggerConfetti();
      return;
    }

    moveNoButton();
  };

  const steps = [
    
    <motion.div key="step0" className="text-center" {...fadeInUp}>
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
        Will you go on a date with me?
      </h1>
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="https://media1.tenor.com/m/59regbBE_kwAAAAd/tkthao219-bubududu.gif"
        alt="Cute bear proposal gif"
        className="w-full max-w-md mx-auto mb-4 rounded-lg shadow-lg"
      />
      <div className="relative mx-auto flex min-h-[170px] max-w-md items-start justify-center gap-4">
        <Button
          onClick={() => {
            handleAnswer("isAvailable", true);
            triggerConfetti();
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          Yes, I&apos;d love to!
        </Button>
        <motion.div
          animate={noButtonOffset}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <Button
            variant="outline"
            onMouseEnter={handleNoHover}
            onClick={handleNoClick}
            className="border-pink-300 text-pink-500 hover:bg-pink-100 font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {noHoverCount >= 3 ? "Yes" : "No"}
          </Button>
        </motion.div>
      </div>
    </motion.div>,

    
    <motion.div key="step1" className="text-center" {...fadeInUp}>
      <StepCard stepNumber={1} totalSteps={6}>
      <h2 className="text-4xl sm:text-5xl font-playfair font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">
        YEYYYYYYYY, WHEN SHALL WE GO?
      </h2>
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="https://media.tenor.com/WiQQRwR2QFAAAAAi/cute-panda.gif"
        alt="Excited bear gif"
        className="w-full max-w-md mx-auto mb-6 rounded-2xl shadow-2xl shadow-pink-300/30"
      />
      <div className="mb-6 p-4 bg-white rounded-lg shadow-lg">
        <Calendar
          mode="single"
          selected={answers.date || undefined}
          defaultMonth={answers.date || new Date(2026, 5, 29)}
          onSelect={(date) => setAnswers({ ...answers, date: date || null })}
          className="mx-auto mb-4 w-full max-w-md"
        />
        <div className="flex gap-3 justify-center mt-4">
          <Select value={hour} onValueChange={(val) => setHour(val)}>
            <SelectTrigger className="w-24 bg-pink-50 border-pink-200 text-pink-700">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <SelectItem key={h} value={`${h}`}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={minute} onValueChange={(val) => setMinute(val)}>
            <SelectTrigger className="w-20 bg-pink-50 border-pink-200 text-pink-700">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {['00', '15', '30', '45'].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ampm} onValueChange={(val) => setAmpm(val)}>
            <SelectTrigger className="w-20 bg-pink-50 border-pink-200 text-pink-700">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              {['AM', 'PM'].map((ap) => (
                <SelectItem key={ap} value={ap}>
                  {ap}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={() => setStep(step + 1)}
        disabled={!answers.date || !answers.time}
        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-95 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        <Clock className="mr-2 h-5 w-5" /> Set our date!{" "}
        <Heart className="ml-2 h-5 w-5" />
      </Button>
      </StepCard>
    </motion.div>,

  
    <motion.div key="step2" className="text-center" {...fadeInUp}>
      <StepCard stepNumber={2} totalSteps={6}>
      <h2 className="text-4xl sm:text-5xl font-playfair font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">
        Here&apos;s what&apos;s on the menu, my dear
      </h2>
      <p className="mb-6 text-base text-rose-500">
        Name : <span className="font-semibold">{restaurantName}</span><br />
        Restaurant address: <span className="font-semibold">{restaurantAddress}</span>
      </p>
      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
        {restaurantMenu.map(({ name, icon }) => (
          <div
            key={name}
            className="rounded-2xl border border-pink-200 bg-white/90 p-5 text-pink-600 shadow-md"
          >
            <div className="mb-3 flex justify-center">{icon}</div>
            <p className="text-center font-bold">{name}</p>
          </div>
        ))}
      </div>
      <Button
        onClick={() => {
          setAnswers((prev) => ({
            ...prev,
            restaurantName,
            restaurantAddress,
            food: restaurantMenu.map((item) => item.name),
          }));
          setStep(step + 1);
        }}
        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-95 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        See the next stop! 🍽️
      </Button>
      </StepCard>
    </motion.div>,

     
    <motion.div key="step3" className="text-center" {...fadeInUp}>
      <StepCard stepNumber={3} totalSteps={6}>
      <h2 className="text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">
        Where shall we make our photo book together?
      </h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        {[...photoBookPlaces.map((place) => place.name), "Enter the place you want"].map((photoBook) => (
          <motion.button
            key={photoBook}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-lg bg-white px-6 py-4 font-bold text-pink-600 shadow-md transition-colors duration-300 hover:bg-pink-100 ${
              answers.photoBook === photoBook ? "ring-2 ring-pink-400" : ""
            }`}
            onClick={() => {
              if (photoBook === "Enter the place you want") {
                setIsCustomPhotoBook(true);
                setAnswers({
                  ...answers,
                  photoBook: customPhotoBookName,
                  photoBookAddress: "",
                });
              } else {
                setIsCustomPhotoBook(false);
                const selectedPlace = photoBookPlaces.find((place) => place.name === photoBook);
                setAnswers({
                  ...answers,
                  photoBook,
                  photoBookAddress: selectedPlace?.address || "",
                });
              }
            }}
          >
            <Camera className="mx-auto mb-2" />
            {photoBook}
          </motion.button>
        ))}
      </div>
      {isCustomPhotoBook && (
        <div className="mb-6 rounded-2xl border border-pink-200 bg-white/90 p-5 text-left shadow-lg space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-pink-400">
              Place name
            </label>
            <input
              value={customPhotoBookName}
              onChange={(event) => {
                const nextName = event.target.value;
                setCustomPhotoBookName(nextName);
                setAnswers((prev) => ({
                  ...prev,
                  photoBook: nextName,
                  photoBookAddress: customPhotoBookAddress,
                }));
              }}
              placeholder="Enter photo place name"
              className="w-full rounded-xl border border-pink-200 px-4 py-3 text-pink-700 outline-none transition focus:border-pink-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-pink-400">
              Address
            </label>
            <input
              value={customPhotoBookAddress}
              onChange={(event) => {
                const nextAddress = event.target.value;
                setCustomPhotoBookAddress(nextAddress);
                setAnswers((prev) => ({
                  ...prev,
                  photoBook: customPhotoBookName,
                  photoBookAddress: nextAddress,
                }));
              }}
              placeholder="Enter address"
              className="w-full rounded-xl border border-pink-200 px-4 py-3 text-pink-700 outline-none transition focus:border-pink-400"
            />
          </div>
        </div>
      )}
      {answers.photoBook && (
        <div className="mb-6 rounded-2xl border border-pink-200 bg-white/90 p-5 text-left shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-400">Selected place</p>
          <p className="mt-2 text-xl font-bold text-pink-700">{answers.photoBook}</p>
          <p className="mt-2 text-base text-rose-500">{answers.photoBookAddress}</p>
        </div>
      )}
      <Button
        onClick={() => setStep(step + 1)}
        disabled={!answers.photoBook || !answers.photoBookAddress}
        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-95 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        Save our stop!
      </Button>
      </StepCard>
    </motion.div>,

    
    <motion.div key="step4" className="text-center" {...fadeInUp}>
      <StepCard stepNumber={4} totalSteps={6}>
      <h2 className="text-4xl sm:text-5xl font-playfair font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">
        How excited are you for our date?
      </h2>
      <div className="max-w-lg mx-auto mb-8 p-8 bg-gradient-to-b from-white/80 to-pink-50/60 rounded-2xl shadow-lg border border-pink-100">
        <Slider
          defaultValue={[50]}
          max={100}
          step={25}
          onValueChange={(value) =>
            setAnswers({ ...answers, excitement: value[0] })
          }
        />
        <div className="flex justify-between mt-6 text-sm text-pink-600 font-semibold">
          <span>😐 Can&apos;t wait!</span>
          <span>🤩 Super duper excited!</span>
        </div>
      </div>
      <motion.div
        className="text-4xl font-playfair font-bold text-pink-600 mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        Excitement level: <span className="text-rose-500">{answers.excitement}%</span>
      </motion.div>
      <Button
        onClick={() => {
          setStep(step + 1);
          setTimeout(triggerConfetti, 500);
        }}
        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-95 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Let&apos;s make it official! 💕
      </Button>
      </StepCard>
    </motion.div>,

     
    <motion.div key="step5" className="text-center" {...fadeInUp}>
      <StepCard stepNumber={6} totalSteps={6}>
      <h2 className="text-5xl sm:text-6xl font-playfair font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
        It&apos;s a date, my love!
      </h2>
      <p className="text-lg text-rose-500 mb-3 font-poppins">
        I can&apos;t wait to see you on:
      </p>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="inline-block bg-gradient-to-r from-pink-100 to-rose-100 px-6 py-4 rounded-2xl border border-pink-200 mb-8"
      >
        <p className="text-3xl font-playfair font-bold text-pink-700">
          {formatDate(answers.date)} at {answers.time}
        </p>
      </motion.div>
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="https://media.tenor.com/yvUCU981VYoAAAAj/mochi-cat-goma.gif"
        alt="Excited bear gif"
        className="w-full max-w-md mx-auto mb-6 rounded-2xl shadow-2xl shadow-pink-300/30"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Heart className="text-red-500 w-16 h-16 mx-auto mt-6 animate-pulse" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-8 space-y-3 text-lg text-pink-600 font-poppins"
      >
        <p className="text-base">We&apos;ll go to the restaurant at <span className="font-semibold">{restaurantAddress}</span> and enjoy some delicious <span className="font-semibold">{answers.food.join(", ")}</span>.</p>
        <p className="text-base">After that, we&apos;ll go to <span className="font-semibold italic">{answers.photoBook}</span> and make our photo book together.</p>
        <p className="text-sm text-rose-400">{answers.photoBookAddress}</p>
        <p className="text-xl font-playfair font-bold mt-6">
          Your excitement level: <span className="text-rose-600">{answers.excitement}/100</span>
        </p>
      </motion.div>
      <div className="mt-6">
        {saveState === "saving" && (
          <p className="text-sm font-semibold text-rose-500">Saving to Google Sheets...</p>
        )}
        {saveState === "success" && (
          <p className="text-sm font-semibold text-green-600">Saved to Google Sheets successfully.</p>
        )}
        {saveState === "error" && (
          <p className="text-sm font-semibold text-red-500">Save failed: {saveError}</p>
        )}
      </div>
      </StepCard>
    </motion.div>,
  ];

  useEffect(() => {
    const saveAnswers = async () => {
      console.log('Saved answers:', answers);
      setSaveState("saving");
      setSaveError("");
      
      // Save to localStorage
      localStorage.setItem('dateProposalAnswers', JSON.stringify(answers));

      try {
        const response = await fetch('/api/send-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unknown Google Sheets error");
        }

        setSaveState("success");
      } catch (error) {
        console.error('Failed to send response:', error);
        setSaveState("error");
        setSaveError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    if (step === steps.length - 1 && saveState === "idle") {
      saveAnswers();
    }
  }, [step, answers, saveState, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex items-center justify-center p-6">
      <Suspense fallback={null}>
        <HeartBackground />
      </Suspense>
      <div className="relative w-full max-w-3xl">
        <FloatingOrbs />
        <ThemedCard>
          <Sparkles count={18} />
          <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
        </ThemedCard>
        <FairyFooter />
      </div>
    </div>
  );
}
