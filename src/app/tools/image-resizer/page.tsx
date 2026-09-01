'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, Sparkles, Sliders, Image as ImageIcon, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

interface ExamPreset {
  id: string;
  name: string;
  type: 'photo' | 'signature' | 'thumb';
  targetKB: number;
  width: number;
  height: number;
  description: string;
}

const PRESETS: ExamPreset[] = [
  { id: 'ssc-photo', name: 'SSC CGL / CHSL / MTS Photo', type: 'photo', targetKB: 50, width: 200, height: 230, description: '20 KB to 50 KB (3.5cm x 4.5cm)' },
  { id: 'ssc-sign', name: 'SSC Signature', type: 'signature', targetKB: 20, width: 140, height: 60, description: '10 KB to 20 KB (4.0cm x 2.0cm)' },
  { id: 'upsc-photo', name: 'UPSC Civil Services Photo', type: 'photo', targetKB: 100, width: 350, height: 350, description: '20 KB to 300 KB (Square / 350x350)' },
  { id: 'upsc-sign', name: 'UPSC Signature', type: 'signature', targetKB: 50, width: 350, height: 150, description: '20 KB to 300 KB (350x150)' },
  { id: 'rrb-photo', name: 'Railway RRB Photo', type: 'photo', targetKB: 50, width: 200, height: 230, description: '20 KB to 50 KB (White background)' },
  { id: 'bank-photo', name: 'IBPS / SBI Bank Photo', type: 'photo', targetKB: 50, width: 200, height: 230, description: '20 KB to 50 KB' },
  { id: 'bank-thumb', name: 'IBPS Left Thumb Impression', type: 'thumb', targetKB: 50, width: 240, height: 240, description: '20 KB to 50 KB' },
];

export default function ImageResizerPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>('ssc-photo');
  const [customKB, setCustomKB] = useState<number>(50);
  const [customWidth, setCustomWidth] = useState<number>(200);
  const [customHeight, setCustomHeight] = useState<number>(230);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [resizedSizeKB, setResizedSizeKB] = useState<number>(0);
  // processing state

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSizeKB(Math.round(file.size / 1024));
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setPreviewOriginal(src);
      processImage(src);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (imageSrc: string) => {
    

    const preset = PRESETS.find((p) => p.id === selectedPreset);
    const targetKB = isCustom ? customKB : preset?.targetKB || 50;
    const targetWidth = isCustom ? customWidth : preset?.width || 200;
    const targetHeight = isCustom ? customHeight : preset?.height || 230;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        
        return;
      }

      // Draw with white background for crisp passport photos
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Binary search quality adjustment to hit target file size in KB
      let minQuality = 0.1;
      let maxQuality = 0.98;
      let bestDataUrl = canvas.toDataURL('image/jpeg', maxQuality);
      let bestSizeKB = Math.round((bestDataUrl.length * 3) / 4 / 1024);

      for (let i = 0; i < 8; i++) {
        const midQuality = (minQuality + maxQuality) / 2;
        const testDataUrl = canvas.toDataURL('image/jpeg', midQuality);
        const testSizeKB = Math.round((testDataUrl.length * 3) / 4 / 1024);

        if (testSizeKB <= targetKB) {
          bestDataUrl = testDataUrl;
          bestSizeKB = testSizeKB;
          minQuality = midQuality; // Try higher quality
        } else {
          maxQuality = midQuality; // Reduce quality
        }
      }

      setResizedImage(bestDataUrl);
      setResizedSizeKB(bestSizeKB);
      
    };
    img.src = imageSrc;
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    setIsCustom(false);
    if (previewOriginal) {
      setTimeout(() => {
        const p = PRESETS.find((item) => item.id === presetId);
        if (p) {
          setCustomKB(p.targetKB);
          setCustomWidth(p.width);
          setCustomHeight(p.height);
        }
        processImage(previewOriginal);
      }, 50);
    }
  };

  const handleDownload = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `sarkari-resized-${selectedPreset}-${resizedSizeKB}kb.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Ad Unit */}
        <AdBanner format="leaderboard" slot="tools-top-leaderboard" />

        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 px-3.5 py-1 rounded-full text-xs font-bold">
            <Sparkles size={14} className="text-amber-500" />
            100% Free Online Sarkari Tool &bull; Zero Server Upload
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Sarkari Photo &amp; Signature Resizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Compress and resize your passport photo, signature, and thumb impression to exact KB and pixel limits for SSC, UPSC, Railway (RRB), Banking (IBPS/SBI), and State Police exams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings & Presets Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders size={18} className="text-blue-600" />
                Select Exam Preset
              </h2>

              {/* Preset Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.id && !isCustom;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-850/50'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900 dark:text-white block truncate mb-1">
                        {preset.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Max {preset.targetKB} KB &bull; {preset.width}x{preset.height} px
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Size Toggle */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {isCustom ? '← Back to Presets' : '🔧 Need Custom KB or Dimensions? Click Here'}
                </button>

                {isCustom && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Max KB</label>
                      <input
                        type="number"
                        value={customKB}
                        onChange={(e) => setCustomKB(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <Upload size={22} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">Click to Upload Photo or Signature</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Supports JPG, JPEG, PNG</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Preview & Download Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-emerald-500" />
                Resized Output Preview
              </h2>

              {resizedImage ? (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <div className="text-center space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 block">Original Image</span>
                      <div className="w-32 h-36 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewOriginal || ''} alt="Original Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{originalSizeKB} KB</span>
                    </div>

                    <span className="text-slate-400 font-bold text-sm">&rarr;</span>

                    <div className="text-center space-y-2">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} /> Ready for Form
                      </span>
                      <div className="w-32 h-36 border-2 border-emerald-500 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 shadow-md shadow-emerald-500/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={resizedImage} alt="Resized Output" className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{resizedSizeKB} KB</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <Download size={18} />
                    Download Resized File ({resizedSizeKB} KB)
                  </button>

                  {/* Viral Community Capture Hook */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-500/30 text-center space-y-2">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                      🚀 Never miss application deadlines for SSC &amp; Railways!
                    </span>
                    <a
                      href="https://t.me/formbharlo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-all"
                    >
                      <Send size={14} /> Join Telegram for Free Job Alerts
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                  <ImageIcon size={32} className="mx-auto text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">No Image Selected</span>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Upload your passport photo or signature on the left to see the resized preview and instant download button.
                  </p>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>100% Client-Side Privacy: Your photos are never uploaded to any server.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ad Unit */}
        <AdBanner format="in-feed" slot="tools-bottom-infeed" />
      </div>
    </div>
  );
}
