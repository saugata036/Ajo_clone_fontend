import React, { useState, useRef, useCallback } from "react";
import {
  X,
  Upload,
  Camera,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Heart,
  Check,
  Loader2,
  User,
  Ruler,
  Palette,
  MapPin,
  PartyPopper,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ─────────────────────────── Types ─────────────────────────── */

interface BodyDetails {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  skinTone: string;
  bodyShape: string;
}

interface OccasionDetails {
  culture: string;
  event: string;
  description: string;
}

interface Recommendation {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  overlayDescription: string;
  matchScore: number;
  tags: string[];
  colors: string[];
  fabric: string;
}

type Step = "upload" | "body" | "occasion" | "processing" | "results";

/* ─────────────────────── Mock Recommendations ──────────────── */

const BENGALI_WEDDING_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 101,
    name: "Banarasi Silk Saree – Crimson Red",
    brand: "Taneira",
    price: 8499,
    originalPrice: 14999,
    discount: 43,
    image:
      "https://images.unsplash.com/photo-1610189019599-46fd4edea570?w=400&h=500&fit=crop",
    overlayDescription: "Draped elegantly – perfect for ashirwad ceremony",
    matchScore: 98,
    tags: ["Silk", "Traditional", "Wedding"],
    colors: ["Crimson", "Gold Border"],
    fabric: "Pure Banarasi Silk",
  },
  {
    id: 102,
    name: "Dhakai Jamdani Saree – Ivory White",
    brand: "Fabindia",
    price: 6299,
    originalPrice: 9999,
    discount: 37,
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop",
    overlayDescription: "Classic Bengali bride look – timeless elegance",
    matchScore: 96,
    tags: ["Jamdani", "Handloom", "Bridal"],
    colors: ["Ivory", "Red Border"],
    fabric: "Handwoven Cotton",
  },
  {
    id: 103,
    name: "Tant Cotton Saree – Mustard Yellow",
    brand: "Byloom",
    price: 2199,
    originalPrice: 3499,
    discount: 37,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4c4c?w=400&h=500&fit=crop",
    overlayDescription: "Vibrant festive look – ideal for haldi & mehendi",
    matchScore: 93,
    tags: ["Tant", "Festive", "Cotton"],
    colors: ["Mustard", "Green Border"],
    fabric: "Pure Cotton Tant",
  },
  {
    id: 104,
    name: "Katan Silk Lehenga – Deep Magenta",
    brand: "Sabyasachi",
    price: 24999,
    originalPrice: 39999,
    discount: 38,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
    overlayDescription: "Royal bridal silhouette – designed for grand receptions",
    matchScore: 91,
    tags: ["Lehenga", "Silk", "Reception"],
    colors: ["Magenta", "Gold Zari"],
    fabric: "Katan Silk",
  },
  {
    id: 105,
    name: "Baluchari Silk Saree – Forest Green",
    brand: "Ekaya",
    price: 11999,
    originalPrice: 18500,
    discount: 35,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=500&fit=crop",
    overlayDescription: "Heritage motifs – best suited for your skin tone",
    matchScore: 90,
    tags: ["Baluchari", "Heritage", "Silk"],
    colors: ["Forest Green", "Red Pallu"],
    fabric: "Baluchari Silk",
  },
  {
    id: 106,
    name: "Muslin Saree with Kantha Work – Peach",
    brand: "Craftsvilla",
    price: 4499,
    originalPrice: 6999,
    discount: 36,
    image:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=500&fit=crop",
    overlayDescription: "Light and breathable – perfect for summer weddings",
    matchScore: 88,
    tags: ["Kantha", "Muslin", "Embroidery"],
    colors: ["Peach", "Multi Kantha"],
    fabric: "Fine Muslin",
  },
  {
    id: 107,
    name: "Chanderi Silk Salwar Kameez – Royal Blue",
    brand: "W for Woman",
    price: 3999,
    originalPrice: 6500,
    discount: 38,
    image:
      "https://images.unsplash.com/photo-1631233777566-7e37cc4c4e62?w=400&h=500&fit=crop",
    overlayDescription: "Elegant anarkali – flatters your body shape",
    matchScore: 86,
    tags: ["Salwar", "Chanderi", "Anarkali"],
    colors: ["Royal Blue", "Silver Work"],
    fabric: "Chanderi Silk",
  },
  {
    id: 108,
    name: "Raw Silk Shararara Set – Teal",
    brand: "Anita Dongre",
    price: 15499,
    originalPrice: 23000,
    discount: 33,
    image:
      "https://images.unsplash.com/photo-1603217192634-61068e4d4bf9?w=400&h=500&fit=crop",
    overlayDescription: "Contemporary Bengali fusion – perfect for sangeet",
    matchScore: 85,
    tags: ["Sharara", "Fusion", "Sangeet"],
    colors: ["Teal", "Gold Embroidery"],
    fabric: "Raw Silk",
  },
  {
    id: 109,
    name: "Linen Kurta with Dhoti Pants – Off White",
    brand: "Manyavar",
    price: 5299,
    originalPrice: 8500,
    discount: 38,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop",
    overlayDescription: "Minimalist Bengali elegance – kurta-dhoti combo",
    matchScore: 83,
    tags: ["Dhoti", "Kurta", "Traditional"],
    colors: ["Off White", "Gold Trim"],
    fabric: "Premium Linen",
  },
  {
    id: 110,
    name: "Georgette Saree – Saffron Orange",
    brand: "Nalli",
    price: 3799,
    originalPrice: 5999,
    discount: 37,
    image:
      "https://images.unsplash.com/photo-1602910344008-22f323cc1817?w=400&h=500&fit=crop",
    overlayDescription: "Light drape – great for outdoor Bengali ceremonies",
    matchScore: 82,
    tags: ["Georgette", "Light", "Outdoor"],
    colors: ["Saffron", "Zari Border"],
    fabric: "Georgette",
  },
];

/* ─────────────────────── Skin Tone Options ─────────────────── */

const SKIN_TONES = [
  { label: "Fair", value: "fair", bg: "#FDDBB4" },
  { label: "Light", value: "light", bg: "#E8BFA0" },
  { label: "Medium", value: "medium", bg: "#C68642" },
  { label: "Olive", value: "olive", bg: "#9B7B5A" },
  { label: "Dark", value: "dark", bg: "#6B4226" },
  { label: "Deep", value: "deep", bg: "#3B1F0A" },
];

const BODY_SHAPES = ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"];

const CULTURES = [
  "Bengali",
  "Marathi",
  "Tamil",
  "Rajasthani",
  "Punjabi",
  "Gujarati",
  "Kannada",
  "Telugu",
  "Kashmiri",
  "Other",
];

const EVENTS = [
  "Wedding / Bibaho",
  "Reception",
  "Engagement / Adhibas",
  "Sangeet / Nachgaan",
  "Haldi / Gaye Holud",
  "Pooja / Religious Ceremony",
  "Festival (Durga Puja, Eid, etc.)",
  "Casual Gathering",
];

/* ─────────────────────── Score Ring Component ───────────────── */

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  return (
    <svg width={44} height={44} className="-rotate-90">
      <circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={3} />
      <circle
        cx={22}
        cy={22}
        r={r}
        fill="none"
        stroke={score >= 90 ? "#16a34a" : score >= 80 ? "#d97706" : "#dc2626"}
        strokeWidth={3}
        strokeDasharray={circ}
        strokeDashoffset={circ - progress}
        strokeLinecap="round"
      />
      <text
        x={22}
        y={22}
        dominantBaseline="middle"
        textAnchor="middle"
        className="rotate-90"
        fontSize={9}
        fontWeight={700}
        fill="#111"
        style={{ transform: "rotate(90deg)", transformOrigin: "22px 22px" }}
      >
        {score}%
      </text>
    </svg>
  );
};

/* ─────────────────── Processing Animation Component ─────────── */

const ProcessingScreen: React.FC<{ imagePreview: string | null }> = ({ imagePreview }) => {
  const steps = [
    "Analyzing your body measurements…",
    "Detecting skin tone & body shape…",
    "Processing cultural occasion context…",
    "Scanning 10,000+ ethnic collections…",
    "Computing AI style compatibility scores…",
    "Generating virtual try-on visuals…",
    "Ranking top recommendations for you…",
  ];
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < steps.length) {
        setCurrentStep(i);
      } else {
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 gap-6">
      {/* Avatar with scan animation */}
      <div className="relative w-36 h-44">
        {imagePreview ? (
          <img src={imagePreview} alt="You" className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
            <User size={60} className="text-purple-400" />
          </div>
        )}
        {/* Scanning overlay */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e31837] to-transparent animate-scan" />
        </div>
        <div className="absolute inset-0 rounded-xl border-2 border-[#e31837]/60 animate-pulse" />
      </div>

      <div className="text-center">
        <div className="flex items-center gap-2 justify-center mb-1">
          <Loader2 size={18} className="animate-spin text-[#e31837]" />
          <span className="font-semibold text-gray-800 text-sm">AI is styling you…</span>
        </div>
        <p className="text-xs text-gray-500 max-w-xs">{steps[currentStep]}</p>
      </div>

      <div className="w-full max-w-xs space-y-1.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                i < currentStep
                  ? "bg-green-500"
                  : i === currentStep
                  ? "bg-[#e31837] animate-pulse"
                  : "bg-gray-200"
              )}
            >
              {i < currentStep && <Check size={10} className="text-white" />}
            </div>
            <span
              className={cn(
                "text-xs transition-colors duration-300",
                i < currentStep ? "text-green-600 font-medium" : i === currentStep ? "text-[#e31837] font-medium" : "text-gray-400"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────── Recommendation Card Component ─────────── */

/* ─────────────────────── Try-On Viewer Component ───────────── */

const TryOnViewer: React.FC<{
  rec: Recommendation;
  userImage: string | null;
  allRecs: Recommendation[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onAddToCart: () => void;
}> = ({ rec, userImage, allRecs, currentIndex, onClose, onNext, onPrev, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "overlay">(userImage ? "split" : "overlay");

  const handleAdd = () => {
    setAdded(true);
    onAddToCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center" onClick={onClose}>
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Viewer panel */}
      <div
        className="relative z-10 w-full max-w-5xl mx-4 bg-[#0f0f1a] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#e31837] to-purple-600 rounded-xl flex items-center justify-center">
              <Camera size={15} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">Virtual Try-On</p>
              <p className="text-white/50 text-xs">{currentIndex + 1} of {allRecs.length} outfits</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle — only if user uploaded photo */}
            {userImage && (
              <div className="flex bg-white/10 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setViewMode("split")}
                  className={cn("text-xs px-3 py-1 rounded-lg font-medium transition-all", viewMode === "split" ? "bg-white text-black" : "text-white/60 hover:text-white")}
                >
                  Side by Side
                </button>
                <button
                  onClick={() => setViewMode("overlay")}
                  className={cn("text-xs px-3 py-1 rounded-lg font-medium transition-all", viewMode === "overlay" ? "bg-white text-black" : "text-white/60 hover:text-white")}
                >
                  Overlay
                </button>
              </div>
            )}
            <button onClick={onClose} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Main visual area */}
        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

          {/* ── Left: navigation arrow ── */}
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-all backdrop-blur"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>

          {/* ── Visual content ── */}
          <div className="flex-1 flex items-center justify-center p-6 gap-6 overflow-hidden">

            {viewMode === "split" && userImage ? (
              /* Side-by-side view */
              <>
                {/* User photo */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-[280px]">
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20">
                    <img src={userImage} alt="You" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white text-xs font-semibold text-center">You</p>
                    </div>
                  </div>
                </div>

                {/* Arrow between */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#e31837] to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <p className="text-white/40 text-xs font-medium">AI Styled</p>
                </div>

                {/* Outfit on user */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-[280px]">
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-[#e31837]/60">
                    <img src={userImage} alt="You" className="w-full h-full object-cover" />
                    {/* Dress overlay */}
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs font-bold text-center">{rec.overlayDescription}</p>
                    </div>
                    {/* AI badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[#e31837] to-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={9} /> AI Styled
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Outfit-only / Overlay view */
              <div className="relative flex-1 max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20 mx-auto">
                {userImage && (
                  <img src={userImage} alt="You" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <img
                  src={rec.image}
                  alt={rec.name}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover",
                    userImage ? "mix-blend-multiply opacity-80" : ""
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white text-sm font-bold">{rec.name}</p>
                  <p className="text-white/70 text-xs mt-1">{rec.overlayDescription}</p>
                </div>
                <div className="absolute top-3 left-3 bg-gradient-to-r from-[#e31837] to-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={9} /> AI Styled
                </div>
              </div>
            )}
          </div>

          {/* ── Right: navigation arrow ── */}
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-all backdrop-blur"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        </div>

        {/* Bottom info panel */}
        <div className="border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Outfit info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white/50 text-xs uppercase tracking-wider">{rec.brand}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="text-purple-300 text-xs">{rec.fabric}</span>
            </div>
            <p className="text-white font-bold text-base mt-0.5 truncate">{rec.name}</p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-lg">₹{rec.price.toLocaleString()}</span>
                <span className="text-white/40 text-sm line-through">₹{rec.originalPrice.toLocaleString()}</span>
                <span className="text-green-400 text-xs font-bold">{rec.discount}% off</span>
              </div>
              <div className="flex items-center gap-1 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
                <Sparkles size={9} /> {rec.matchScore}% Match
              </div>
            </div>
            {/* Color chips */}
            <div className="flex gap-1.5 mt-2">
              {rec.colors.map((c) => (
                <span key={c} className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{c}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={cn(
                "w-11 h-11 rounded-xl border flex items-center justify-center transition-all",
                wishlisted ? "bg-[#e31837]/20 border-[#e31837] text-[#e31837]" : "border-white/20 text-white/50 hover:border-white/40"
              )}
            >
              <Heart size={18} className={cn(wishlisted ? "fill-[#e31837]" : "")} />
            </button>
            <button
              onClick={handleAdd}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                added ? "bg-green-500 text-white" : "bg-gradient-to-r from-[#e31837] to-purple-600 text-white hover:opacity-90"
              )}
            >
              {added ? <><Check size={15} /> Added to Bag!</> : <><ShoppingBag size={15} /> Add to Bag</>}
            </button>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {allRecs.map((r, i) => (
            <button
              key={r.id}
              onClick={() => {
                // handled by parent via onTryOn
                if (i === currentIndex) return;
                if (i > currentIndex) { for (let j = currentIndex; j < i; j++) onNext(); }
                else { for (let j = currentIndex; j > i; j--) onPrev(); }
              }}
              className={cn(
                "flex-shrink-0 w-14 h-18 rounded-xl overflow-hidden border-2 transition-all",
                i === currentIndex ? "border-[#e31837] scale-110 shadow-lg shadow-[#e31837]/40" : "border-transparent opacity-50 hover:opacity-80"
              )}
            >
              <img src={r.image} alt={r.name} className="w-full h-full object-cover" style={{ height: "72px" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecommendationCard: React.FC<{
  rec: Recommendation;
  userImage: string | null;
  index: number;
  onTryOn: () => void;
}> = ({ rec, userImage, index, onTryOn }) => {
  return (
    <div
      onClick={onTryOn}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
    >
      <div className="relative">
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
          <img
            src={rec.image}
            alt={rec.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Try-on hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              {userImage ? <Camera size={22} className="text-white" /> : <Sparkles size={22} className="text-white" />}
            </div>
            <p className="text-white text-xs font-bold">{userImage ? "Wear on Me" : "View Outfit"}</p>
          </div>
        </div>
        <div className="absolute top-2 left-2 bg-[#1a1a2e] text-white text-xs font-bold px-2 py-0.5 rounded-full">
          #{index + 1}
        </div>
        <div className="absolute top-2 right-2 bg-[#e31837] text-white text-xs font-semibold px-1.5 py-0.5 rounded">
          -{rec.discount}%
        </div>
      </div>

      <div className="p-2.5 flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{rec.brand}</p>
        <p className="text-xs font-semibold text-gray-800 mt-0.5 line-clamp-2 flex-1">{rec.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-gray-900">₹{rec.price.toLocaleString()}</span>
          <div className="flex items-center gap-1">
            <ScoreRing score={rec.matchScore} />
          </div>
        </div>
        <div className="mt-2 w-full flex items-center justify-center gap-1 bg-gradient-to-r from-[#e31837] to-purple-600 text-white text-[10px] font-bold py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          {userImage ? <><Camera size={10} /> Try On Me</> : <><Sparkles size={10} /> View Outfit</>}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── Main Modal Component ───────────────── */

interface VirtualTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const VirtualTrialModal: React.FC<VirtualTrialModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bodyDetails, setBodyDetails] = useState<BodyDetails>({
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    skinTone: "",
    bodyShape: "",
  });
  const [occasionDetails, setOccasionDetails] = useState<OccasionDetails>({
    culture: "Bengali",
    event: "Wedding / Bibaho",
    description: "",
  });
  const [recommendations] = useState<Recommendation[]>(BENGALI_WEDDING_RECOMMENDATIONS);
  const [tryOnIndex, setTryOnIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recScrollRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleProcessing = () => {
    setStep("processing");
    setTimeout(() => setStep("results"), 4000);
  };

  const resetModal = () => {
    setStep("upload");
    setImagePreview(null);
    setBodyDetails({ height: "", weight: "", chest: "", waist: "", hips: "", skinTone: "", bodyShape: "" });
    setOccasionDetails({ culture: "Bengali", event: "Wedding / Bibaho", description: "" });
  };

  if (!isOpen) return null;

  /* ── Try-On Viewer overlay ── */
  const TryOnOverlay = tryOnIndex !== null ? (
    <TryOnViewer
      rec={recommendations[tryOnIndex]}
      userImage={imagePreview}
      allRecs={recommendations}
      onClose={() => setTryOnIndex(null)}
      onNext={() => setTryOnIndex((i) => ((i ?? 0) + 1) % recommendations.length)}
      onPrev={() => setTryOnIndex((i) => ((i ?? 0) - 1 + recommendations.length) % recommendations.length)}
      currentIndex={tryOnIndex}
      onAddToCart={() => {}}
    />
  ) : null;

  /* ── Step indicators ── */
  const STEPS: { id: Step; label: string }[] = [
    { id: "upload", label: "Your Photo" },
    { id: "body", label: "Body Info" },
    { id: "occasion", label: "Occasion" },
    { id: "processing", label: "AI Magic" },
    { id: "results", label: "Outfits" },
  ];
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={step !== "processing" ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#e31837] rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Virtual Trial Room</h2>
              <p className="text-xs text-blue-200 leading-tight">AI-Powered Style Recommendation</p>
            </div>
          </div>
          {step !== "processing" && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        {step !== "processing" && (
          <div className="px-6 pt-4 pb-3 bg-gray-50 border-b flex-shrink-0">
            <div className="flex items-center gap-0">
              {STEPS.filter((s) => s.id !== "processing").map((s, i, arr) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        stepIndex > STEPS.findIndex((x) => x.id === s.id)
                          ? "bg-green-500 text-white"
                          : stepIndex === STEPS.findIndex((x) => x.id === s.id)
                          ? "bg-[#e31837] text-white ring-4 ring-[#e31837]/20"
                          : "bg-gray-200 text-gray-400"
                      )}
                    >
                      {stepIndex > STEPS.findIndex((x) => x.id === s.id) ? (
                        <Check size={12} />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className="text-[9px] mt-1 font-medium text-gray-500 hidden sm:block">{s.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-1 transition-all",
                        stepIndex > STEPS.findIndex((x) => x.id === arr[i].id)
                          ? "bg-green-400"
                          : "bg-gray-200"
                      )}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* ── STEP 1: Upload Photo ── */}
          {step === "upload" && (
            <div className="p-6 flex flex-col gap-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">Upload Your Photo</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Our AI will analyze your features and recommend outfits that suit you perfectly
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Upload area */}
                <div
                  className={cn(
                    "flex-1 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all min-h-[240px]",
                    isDragging
                      ? "border-[#e31837] bg-[#e31837]/5 scale-[1.02]"
                      : imagePreview
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-[#e31837] hover:bg-[#e31837]/5"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-36 h-48 object-cover rounded-xl shadow-md" />
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-[#e31837]/10 to-purple-100 rounded-2xl flex items-center justify-center">
                        <Upload size={28} className="text-[#e31837]" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700">Drop your photo here</p>
                        <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 10MB</p>
                      </div>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                />

                {/* Tips */}
                <div className="md:w-64 flex flex-col gap-3">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-sm font-semibold text-purple-800 mb-2">📸 Best Photo Tips</p>
                    <ul className="space-y-1.5">
                      {[
                        "Full body photo preferred",
                        "Stand straight, facing forward",
                        "Good lighting (natural is best)",
                        "Wear fitted or minimal clothing",
                        "Plain background works best",
                      ].map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-xs text-purple-700">
                          <span className="mt-0.5 text-purple-400">✦</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                    <p className="text-sm font-semibold text-orange-800 mb-1">🔒 Privacy First</p>
                    <p className="text-xs text-orange-700">
                      Your photo is processed locally and never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => { setImagePreview(null); setStep("body"); }}
                  className="text-sm text-gray-400 hover:text-gray-600 underline"
                >
                  Skip photo upload
                </button>
                <button
                  onClick={() => setStep("body")}
                  disabled={!imagePreview}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    imagePreview
                      ? "bg-[#e31837] text-white hover:bg-[#c41230] shadow-lg shadow-[#e31837]/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  Next: Body Info <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Body Details ── */}
          {step === "body" && (
            <div className="p-6 flex flex-col gap-5">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">Your Body Details</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Help our AI find the most flattering fits for your figure
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Measurements */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler size={15} className="text-[#e31837]" />
                    <span className="font-semibold text-sm text-gray-800">Measurements</span>
                  </div>
                  {[
                    { key: "height", label: "Height", placeholder: "e.g. 162 cm", unit: "cm" },
                    { key: "weight", label: "Weight", placeholder: "e.g. 58 kg", unit: "kg" },
                    { key: "chest", label: "Chest / Bust", placeholder: "e.g. 36 inches", unit: "in" },
                    { key: "waist", label: "Waist", placeholder: "e.g. 30 inches", unit: "in" },
                    { key: "hips", label: "Hips", placeholder: "e.g. 38 inches", unit: "in" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="flex items-center gap-3">
                      <label className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={bodyDetails[key as keyof BodyDetails]}
                        onChange={(e) =>
                          setBodyDetails((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#e31837] bg-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Skin Tone */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Palette size={15} className="text-[#e31837]" />
                      <span className="font-semibold text-sm text-gray-800">Skin Tone</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {SKIN_TONES.map((tone) => (
                        <button
                          key={tone.value}
                          onClick={() => setBodyDetails((p) => ({ ...p, skinTone: tone.value }))}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                            bodyDetails.skinTone === tone.value
                              ? "border-[#e31837] scale-110 shadow"
                              : "border-transparent hover:border-gray-200"
                          )}
                        >
                          <div
                            className="w-8 h-8 rounded-full shadow-sm"
                            style={{ backgroundColor: tone.bg }}
                          />
                          <span className="text-[9px] text-gray-600">{tone.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Shape */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User size={15} className="text-[#e31837]" />
                      <span className="font-semibold text-sm text-gray-800">Body Shape</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {BODY_SHAPES.map((shape) => (
                        <button
                          key={shape}
                          onClick={() => setBodyDetails((p) => ({ ...p, bodyShape: shape }))}
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-full border transition-all font-medium",
                            bodyDetails.bodyShape === shape
                              ? "bg-[#e31837] text-white border-[#e31837]"
                              : "border-gray-200 text-gray-600 hover:border-[#e31837] hover:text-[#e31837]"
                          )}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep("upload")}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setStep("occasion")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#e31837] text-white hover:bg-[#c41230] shadow-lg shadow-[#e31837]/20 transition-all"
                >
                  Next: Occasion <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Occasion Details ── */}
          {step === "occasion" && (
            <div className="p-6 flex flex-col gap-5">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">Tell Us the Occasion</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We'll curate culturally appropriate outfits just for you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Culture */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={15} className="text-[#e31837]" />
                    <span className="font-semibold text-sm text-gray-800">Your Cultural Background</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CULTURES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setOccasionDetails((p) => ({ ...p, culture: c }))}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-full border transition-all font-medium",
                          occasionDetails.culture === c
                            ? "bg-[#e31837] text-white border-[#e31837]"
                            : "border-gray-200 text-gray-600 hover:border-[#e31837] hover:text-[#e31837]"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Event type */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <PartyPopper size={15} className="text-[#e31837]" />
                    <span className="font-semibold text-sm text-gray-800">Type of Event</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {EVENTS.map((ev) => (
                      <button
                        key={ev}
                        onClick={() => setOccasionDetails((p) => ({ ...p, event: ev }))}
                        className={cn(
                          "text-xs text-left px-3 py-2 rounded-lg border transition-all",
                          occasionDetails.event === ev
                            ? "bg-[#e31837]/10 border-[#e31837] text-[#e31837] font-semibold"
                            : "border-gray-200 text-gray-600 hover:border-[#e31837]"
                        )}
                      >
                        {ev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional description */}
              <div className="bg-gradient-to-r from-[#e31837]/5 to-purple-50 border border-[#e31837]/20 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  🌸 Describe your needs in detail <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={`Example: I am attending a Bengali wedding as a guest. I prefer vibrant colors like red, gold, or green. I want something traditional yet elegant with modern draping style…`}
                  value={occasionDetails.description}
                  onChange={(e) => setOccasionDetails((p) => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#e31837] bg-white"
                />
              </div>

              {/* Preview summary */}
              <div className="bg-white border border-purple-100 rounded-xl p-4 flex gap-4 items-center">
                {imagePreview && (
                  <img src={imagePreview} alt="you" className="w-14 h-18 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex flex-col gap-1 text-xs text-gray-600">
                  <p><span className="font-semibold text-gray-800">Culture:</span> {occasionDetails.culture}</p>
                  <p><span className="font-semibold text-gray-800">Event:</span> {occasionDetails.event}</p>
                  {bodyDetails.height && <p><span className="font-semibold text-gray-800">Height:</span> {bodyDetails.height}</p>}
                  {bodyDetails.bodyShape && <p><span className="font-semibold text-gray-800">Body Shape:</span> {bodyDetails.bodyShape}</p>}
                  {bodyDetails.skinTone && <p><span className="font-semibold text-gray-800">Skin Tone:</span> {bodyDetails.skinTone}</p>}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep("body")}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={handleProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#e31837] to-purple-600 text-white hover:opacity-90 shadow-xl shadow-[#e31837]/30 transition-all"
                >
                  <Sparkles size={15} />
                  Find My Outfits
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Processing ── */}
          {step === "processing" && (
            <div className="p-6 min-h-[420px]">
              <ProcessingScreen imagePreview={imagePreview} />
            </div>
          )}

          {/* ── STEP 5: Results ── */}
          {step === "results" && (
            <div className="p-5 flex flex-col gap-4">
              {/* Results header */}
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-[#e31837]" />
                    <h3 className="text-base font-bold text-gray-900">
                      Your AI-Curated Outfits
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showing <span className="font-semibold text-[#e31837]">{recommendations.length} top picks</span> for&nbsp;
                    <span className="font-semibold text-gray-700">{occasionDetails.culture} {occasionDetails.event}</span>
                  </p>
                </div>
                <button
                  onClick={resetModal}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#e31837] border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <RefreshCw size={12} /> Re-analyze
                </button>
              </div>

              {/* AI insight banner */}
              <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white rounded-xl p-4 flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="you" className="w-12 h-16 object-cover rounded-lg flex-shrink-0 ring-2 ring-white/30" />
                )}
                <div>
                  <p className="text-xs font-bold text-yellow-300 mb-1">✨ AI Style Insight</p>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Based on your <strong className="text-white">{bodyDetails.bodyShape || "figure"}</strong> and&nbsp;
                    <strong className="text-white">{bodyDetails.skinTone || "complexion"}</strong>, we recommend
                    rich jewel tones like deep red, saffron, and forest green in silk and handloom fabrics.
                    Sarees with broad borders will beautifully complement your proportions for the&nbsp;
                    <strong className="text-white">{occasionDetails.event}</strong>.
                  </p>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {["All", "Sarees", "Lehenga", "Salwar", "Fusion"].map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "text-xs px-4 py-1.5 rounded-full border font-medium whitespace-nowrap transition-all",
                      tab === "All"
                        ? "bg-[#e31837] text-white border-[#e31837]"
                        : "border-gray-200 text-gray-600 hover:border-[#e31837]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Recommendations grid */}
              <div
                ref={recScrollRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              >
                {recommendations.map((rec, i) => (
                  <RecommendationCard
                    key={rec.id}
                    rec={rec}
                    userImage={imagePreview}
                    index={i}
                    onTryOn={() => setTryOnIndex(i)}
                  />
                ))}
              </div>

              {/* Footer CTA */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-gray-800">
                  🛍️ Like what you see? Add outfits to your cart and checkout!
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Use code <span className="font-bold text-[#e31837]">AISTYLE20</span> for 20% off your first AI-recommended purchase
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {TryOnOverlay}

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default VirtualTrialModal;
