"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  Sparkles,
  ShoppingBag,
  Rotate3d,
  Heart,
  Check,
  Award,
  Zap,
} from "lucide-react";

export function ProductHero3D({
  product,
  selectedVariant,
  onSelectVariant,
}) {
  const { format, isPakistanMarket } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const containerRef = useRef(null);
  const touchStartX = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const isFavorited = isInWishlist(product.id);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const imagesCount = product.images?.length || 0;
    if (imagesCount > 1 && Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> next
        setActiveImageIdx((prev) => (prev + 1) % imagesCount);
      } else {
        // Swiped right -> prev
        setActiveImageIdx((prev) => (prev - 1 + imagesCount) % imagesCount);
      }
    }
    touchStartX.current = null;
  };

  const getThemeColors = () => {
    const colorLower = (selectedVariant?.color || "").toLowerCase();
    if (colorLower.includes("gold") || colorLower.includes("champagne") || colorLower.includes("camel")) {
      return {
        bg: "from-[#F7F2E7] via-[#EFE6D4] to-[#FAF8F5]",
        glow: "rgba(181, 138, 82, 0.4)",
        accent: "#B58A52",
        text: "#171717",
      };
    }
    if (colorLower.includes("rose") || colorLower.includes("pink")) {
      return {
        bg: "from-[#FDF2F2] via-[#FCE4E6] to-[#FAF8F5]",
        glow: "rgba(183, 110, 121, 0.4)",
        accent: "#B76E79",
        text: "#171717",
      };
    }
    if (colorLower.includes("noir") || colorLower.includes("black") || colorLower.includes("charcoal")) {
      return {
        bg: "from-[#222225] via-[#171719] to-[#0F0F11]",
        glow: "rgba(255, 255, 255, 0.25)",
        accent: "#D4AF37",
        text: "#FAF8F5",
        isDark: true,
      };
    }
    if (colorLower.includes("emerald") || colorLower.includes("green")) {
      return {
        bg: "from-[#EFF8F4] via-[#DEEFE6] to-[#FAF8F5]",
        glow: "rgba(16, 185, 129, 0.35)",
        accent: "#065F46",
        text: "#171717",
      };
    }
    return {
      bg: "from-[#FAF6F0] via-[#F0EBE1] to-[#FAF8F5]",
      glow: "rgba(181, 138, 82, 0.35)",
      accent: "#B58A52",
      text: "#171717",
    };
  };

  const theme = getThemeColors();

  const handleMouseMove = (e) => {
    if (isAutoSpinning || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 20;
    const rX = -((y - centerY) / centerY) * 20;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    if (!isAutoSpinning) {
      setRotateX(0);
      setRotateY(0);
    }
  };

  useEffect(() => {
    let animId;
    if (isAutoSpinning) {
      let currentY = rotateY;
      const spin = () => {
        currentY = (currentY + 1.2) % 360;
        setRotateY(currentY);
        setRotateX(Math.sin(currentY * (Math.PI / 180)) * 6);
        animId = requestAnimationFrame(spin);
      };
      animId = requestAnimationFrame(spin);
    }
    return () => cancelAnimationFrame(animId);
  }, [isAutoSpinning, rotateY]);

  const hotspots = [
    {
      id: 1,
      x: "30%",
      y: "35%",
      title: "Hand-Finished Craftsmanship",
      desc: "Hand-finished pick-stitched contours and artisanal micro-detailing.",
    },
    {
      id: 2,
      x: "65%",
      y: "48%",
      title: "Anti-Tarnish / Pure Element",
      desc: "Engineered with 18K gold PVD vacuum coating & scratch-proof crystal.",
    },
    {
      id: 3,
      x: "42%",
      y: "75%",
      title: "Sartorial Ergonomics",
      desc: "Designed to conform comfortably to body movement with natural drape.",
    },
  ];

  const handleQuickAdd = () => {
    addToCart(product, selectedVariant, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const activeImg = product.images?.[activeImageIdx] || product.images?.[0] || { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop" };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${theme.bg} transition-colors duration-700 py-8 sm:py-16 px-4 sm:px-8 border-b border-[#E8E4DC] select-none`}
      style={{ perspective: "1200px" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[110px] pointer-events-none transition-all duration-700 opacity-70 animate-pulse-glow"
        style={{ backgroundColor: theme.glow }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="hidden sm:flex absolute top-[18%] left-[12%] w-10 h-10 rounded-full border border-white/40 bg-white/20 backdrop-blur-md shadow-lg animate-float items-center justify-center"
          style={{
            transform: `translate3d(${rotateY * -0.8}px, ${rotateX * -0.8}px, 40px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="text-[10px] font-bold text-[#B58A52]">
            ✦
          </div>
        </div>

        <div
          className="hidden sm:flex absolute top-[22%] right-[14%] px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#E8E4DC] shadow-xl text-xs font-bold text-[#171717] items-center gap-1.5 animate-float"
          style={{
            transform: `translate3d(${rotateY * 0.9}px, ${rotateX * 0.9}px, 60px)`,
            transition: "transform 0.1s ease-out",
            animationDelay: "1s",
          }}
        >
          <Award className="w-3.5 h-3.5 text-[#B58A52]" />
          <span>Atelier Certified</span>
        </div>

        <div
          className="hidden sm:flex absolute bottom-[28%] left-[10%] px-3 py-1.5 rounded-full bg-[#171717] text-[#FAF8F5] shadow-xl text-[11px] font-bold uppercase tracking-wider items-center gap-1.5 animate-float"
          style={{
            transform: `translate3d(${rotateY * -0.6}px, ${rotateX * -0.6}px, 50px)`,
            transition: "transform 0.1s ease-out",
            animationDelay: "2s",
          }}
        >
          <Zap className="w-3 h-3 text-[#B58A52]" />
          <span>Anti-Tarnish PVD</span>
        </div>

        <div
          className="hidden sm:flex absolute bottom-[22%] right-[12%] w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/40 items-center justify-center text-xs text-[#B58A52] font-serif shadow-lg animate-float"
          style={{
            transform: `translate3d(${rotateY * 0.7}px, ${rotateX * 0.7}px, 35px)`,
            transition: "transform 0.1s ease-out",
            animationDelay: "1.5s",
          }}
        >
          100%
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-4 space-y-5 text-left order-2 lg:order-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E8E4DC] text-[10px] uppercase font-bold tracking-widest text-[#B58A52] shadow-xs mb-3">
              <Sparkles className="w-3 h-3" />
              <span>{product.category} • 2026 Collection</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] text-[#171717]">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="font-serif italic text-sm text-[#71717A] mt-2">
                &ldquo;{product.tagline}&rdquo;
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-3 pt-1">
            <span className="font-serif text-3xl sm:text-4xl font-medium text-[#171717]">
              {format(
                product.basePricePKR + (selectedVariant?.priceAdjustment || 0),
                product.basePriceUSD
              )}
            </span>
            {product.originalPricePKR && (
              <span className="text-sm text-[#A1A1AA] line-through font-light">
                {format(product.originalPricePKR, product.originalPriceUSD || 0)}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#171717] flex justify-between">
              <span>Select Edition / Tone:</span>
              <span className="text-[#B58A52] font-semibold">{selectedVariant?.color || selectedVariant?.sku}</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {(product.variants || []).map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => onSelectVariant(v)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      isSelected
                        ? "bg-[#171717] text-white shadow-xl scale-105 ring-2 ring-[#B58A52]"
                        : "bg-white/80 border border-[#E8E4DC] text-[#171717] hover:border-[#B58A52]"
                    }`}
                  >
                    {v.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <span>{v.color || v.size}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              onClick={handleQuickAdd}
              className={`flex-1 py-4 px-6 rounded-xl text-xs uppercase tracking-[0.18em] font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                addedNotice
                  ? "bg-[#10B981] text-white"
                  : "bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5]"
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added To Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire Piece</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-4 rounded-xl bg-white border border-[#E8E4DC] text-[#171717] hover:text-[#B58A52] shadow-md transition-all hover:scale-105 active:scale-95"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited ? "fill-[#B58A52] text-[#B58A52] scale-110" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-[3/4] flex items-center justify-center transition-transform duration-200 ease-out touch-pan-y"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/60 bg-white/40 backdrop-blur-xs transition-all duration-500"
              style={{
                transform: "translateZ(30px)",
                boxShadow: `0 30px 60px -15px ${theme.glow}, 0 20px 40px -20px rgba(0, 0, 0, 0.4)`,
              }}
            >
              <Image
                src={activeImg.url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover transition-transform duration-700 ease-out hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

              {hotspots.map((h) => (
                <div
                  key={h.id}
                  className="absolute z-30"
                  style={{ top: h.y, left: h.x, transform: "translateZ(50px)" }}
                >
                  <button
                    onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                    className="relative w-6 h-6 rounded-full bg-[#171717] text-white flex items-center justify-center shadow-2xl border-2 border-white hover:scale-125 transition-transform"
                    aria-label={h.title}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#B58A52] animate-ping absolute" />
                    <span className="text-[10px] font-bold">●</span>
                  </button>

                  {activeHotspot === h.id && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-56 p-3 bg-[#171717] text-white rounded-xl shadow-2xl border border-[#B58A52]/40 z-40 text-xs animate-in fade-in zoom-in-95">
                      <div className="font-bold text-[#D4AF37] mb-1">
                        {h.title}
                      </div>
                      <p className="text-[11px] text-[#D4D4D8] leading-tight">
                        {h.desc}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              className="absolute -bottom-8 w-3/4 h-8 bg-black/25 rounded-full blur-xl pointer-events-none transition-all duration-300"
              style={{
                transform: `translateX(${rotateY * -0.5}px) scale(${1 - Math.abs(rotateX) * 0.01})`,
              }}
            />
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => setIsAutoSpinning(!isAutoSpinning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-md transition-all ${
                isAutoSpinning
                  ? "bg-[#B58A52] text-white ring-2 ring-[#B58A52]/50"
                  : "bg-white text-[#171717] border border-[#E8E4DC] hover:border-[#B58A52]"
              }`}
            >
              <Rotate3d className={`w-4 h-4 ${isAutoSpinning ? "animate-spin" : ""}`} />
              <span>{isAutoSpinning ? "Stop 360° Spin" : "360° Interactive Orbit"}</span>
            </button>

            {product.images?.length > 1 && (
              <div className="flex items-center gap-2 bg-white/80 p-1 rounded-full border border-[#E8E4DC]">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx
                        ? "border-[#B58A52] scale-110 shadow-sm"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4 order-3 hidden lg:block">
          <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-[#E8E4DC] shadow-sm space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#B58A52]">
              Material Authenticity
            </div>
            <div className="text-xs font-semibold text-[#171717]">
              Certified Luxury Grade
            </div>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              Constructed to precision European horology and haute couture garment benchmarks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-[#E8E4DC] shadow-sm space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#B58A52]">
              Fulfillment
            </div>
            <div className="text-xs font-semibold text-[#171717]">
              {isPakistanMarket ? "Doorstep Cash on Delivery" : "DHL Worldwide Priority"}
            </div>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              {isPakistanMarket
                ? "2 to 3 days delivery with Leopard & TCS across Pakistan."
                : "4 to 7 days delivery with signature security globally."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-[#E8E4DC] shadow-sm space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#B58A52]">
              Privilege Guarantee
            </div>
            <div className="text-xs font-semibold text-[#171717]">
              14-Day Complimentary Exchange
            </div>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              Hassle-free return policy with doorstep courier pick-up service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
