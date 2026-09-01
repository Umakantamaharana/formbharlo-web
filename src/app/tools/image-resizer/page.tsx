'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Send,
  ShieldCheck,
  CheckCircle2,
  Crop,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  FileText,
  AlertCircle,
  RefreshCw,
  Layers,
  Check,
  Move,
  Maximize2
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

interface ExamPreset {
  id: string;
  name: string;
  category: 'SSC' | 'UPSC' | 'Railways' | 'Banking' | 'State / Other';
  type: 'photo' | 'signature' | 'thumb';
  targetKB: number;
  minKB?: number;
  width: number;
  height: number;
  aspectRatio: number; // width / height
  description: string;
}

const PRESETS: ExamPreset[] = [
  { id: 'ssc-photo', name: 'SSC CGL / CHSL / MTS Photo', category: 'SSC', type: 'photo', targetKB: 50, minKB: 20, width: 200, height: 230, aspectRatio: 200 / 230, description: '20 KB – 50 KB (3.5cm x 4.5cm)' },
  { id: 'ssc-sign', name: 'SSC Signature', category: 'SSC', type: 'signature', targetKB: 20, minKB: 10, width: 140, height: 60, aspectRatio: 140 / 60, description: '10 KB – 20 KB (4.0cm x 2.0cm)' },
  { id: 'upsc-photo', name: 'UPSC Civil Services Photo', category: 'UPSC', type: 'photo', targetKB: 100, minKB: 20, width: 350, height: 350, aspectRatio: 1, description: '20 KB – 300 KB (Square 350x350)' },
  { id: 'upsc-sign', name: 'UPSC Signature', category: 'UPSC', type: 'signature', targetKB: 50, minKB: 20, width: 350, height: 150, aspectRatio: 350 / 150, description: '20 KB – 300 KB (350x150)' },
  { id: 'rrb-photo', name: 'Railway RRB NTPC / Group D Photo', category: 'Railways', type: 'photo', targetKB: 50, minKB: 20, width: 200, height: 230, aspectRatio: 200 / 230, description: '20 KB – 50 KB (White Background)' },
  { id: 'rrb-sign', name: 'Railway RRB Signature', category: 'Railways', type: 'signature', targetKB: 20, minKB: 10, width: 140, height: 60, aspectRatio: 140 / 60, description: '10 KB – 20 KB (Black / Blue Ink)' },
  { id: 'bank-photo', name: 'IBPS / SBI PO & Clerk Photo', category: 'Banking', type: 'photo', targetKB: 50, minKB: 20, width: 200, height: 230, aspectRatio: 200 / 230, description: '20 KB – 50 KB (Passport Size)' },
  { id: 'bank-sign', name: 'IBPS / SBI Signature', category: 'Banking', type: 'signature', targetKB: 20, minKB: 10, width: 140, height: 60, aspectRatio: 140 / 60, description: '10 KB – 20 KB' },
  { id: 'bank-thumb', name: 'IBPS Left Thumb Impression', category: 'Banking', type: 'thumb', targetKB: 50, minKB: 20, width: 240, height: 240, aspectRatio: 1, description: '20 KB – 50 KB (White paper)' },
];

type ResizeMode = 'fit-pad' | 'crop-fill' | 'stretch';
type ExportFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export default function ImageResizerPage() {
  // Preset & Custom Dimensions
  const [selectedPreset, setSelectedPreset] = useState<string>('ssc-photo');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customKB, setCustomKB] = useState<number>(50);
  const [customWidth, setCustomWidth] = useState<number>(200);
  const [customHeight, setCustomHeight] = useState<number>(230);

  // Resize Options & Quality Preservation
  const [resizeMode, setResizeMode] = useState<ResizeMode>('fit-pad');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('image/jpeg');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [customFilename, setCustomFilename] = useState<string>('sarkari_photo');

  // Image Source & Crop Transformation
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number } | null>(null);

  // Crop & Transform Controls
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [cropOffset, setCropOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Output Result
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [resizedSizeKB, setResizedSizeKB] = useState<number>(0);
  const [outputDimensions, setOutputDimensions] = useState<{ w: number; h: number }>({ w: 200, h: 230 });
  const [activeTab, setActiveTab] = useState<'adjust' | 'crop' | 'preview'>('adjust');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Current active targets
  const currentPreset = PRESETS.find((p) => p.id === selectedPreset);
  const targetWidth = isCustom ? customWidth : currentPreset?.width || 200;
  const targetHeight = isCustom ? customHeight : currentPreset?.height || 230;
  const targetKB = isCustom ? customKB : currentPreset?.targetKB || 50;
  const minKB = isCustom ? Math.max(5, Math.floor(customKB * 0.4)) : currentPreset?.minKB || 20;

  // Handle Initial File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    setOriginalSizeKB(Math.round(file.size / 1024));

    // Generate nice default filename based on preset
    const cleanName = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    setCustomFilename(`${cleanName}_${selectedPreset}`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
        setRawImageSrc(src);
        // Reset transforms
        setRotation(0);
        setZoom(1);
        setCropOffset({ x: 0, y: 0 });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // High-Quality Multi-Step Step-Down Resampling Canvas Engine
  const processImage = useCallback(() => {
    if (!rawImageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Step 1: Render transformed image (with rotation, zoom, offset)
      const transformCanvas = document.createElement('canvas');
      const rads = (rotation * Math.PI) / 180;
      const isSideways = rotation % 180 !== 0;

      const baseW = isSideways ? img.height : img.width;
      const baseH = isSideways ? img.width : img.height;

      transformCanvas.width = baseW;
      transformCanvas.height = baseH;
      const tCtx = transformCanvas.getContext('2d');
      if (!tCtx) return;

      tCtx.imageSmoothingEnabled = true;
      tCtx.imageSmoothingQuality = 'high';

      // Fill Background
      tCtx.fillStyle = bgColor;
      tCtx.fillRect(0, 0, baseW, baseH);

      tCtx.save();
      tCtx.translate(baseW / 2, baseH / 2);
      tCtx.rotate(rads);
      tCtx.scale(zoom, zoom);
      tCtx.translate(cropOffset.x, cropOffset.y);
      tCtx.drawImage(img, -img.width / 2, -img.height / 2);
      tCtx.restore();

      // Step 2: Scale to Target Dimensions with High-Fidelity Filtering
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = targetWidth;
      finalCanvas.height = targetHeight;
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill canvas background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      if (resizeMode === 'stretch') {
        ctx.drawImage(transformCanvas, 0, 0, targetWidth, targetHeight);
      } else if (resizeMode === 'crop-fill') {
        // Center crop to fill target without distortion
        const srcRatio = transformCanvas.width / transformCanvas.height;
        const targetRatio = targetWidth / targetHeight;
        let sWidth = transformCanvas.width;
        let sHeight = transformCanvas.height;
        let sx = 0;
        let sy = 0;

        if (srcRatio > targetRatio) {
          sWidth = transformCanvas.height * targetRatio;
          sx = (transformCanvas.width - sWidth) / 2;
        } else {
          sHeight = transformCanvas.width / targetRatio;
          sy = (transformCanvas.height - sHeight) / 2;
        }
        ctx.drawImage(transformCanvas, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
      } else {
        // 'fit-pad': maintain aspect ratio with clean background padding (official exam standard)
        const srcRatio = transformCanvas.width / transformCanvas.height;
        const targetRatio = targetWidth / targetHeight;
        let dWidth = targetWidth;
        let dHeight = targetHeight;
        let dx = 0;
        let dy = 0;

        if (srcRatio > targetRatio) {
          dHeight = targetWidth / srcRatio;
          dy = (targetHeight - dHeight) / 2;
        } else {
          dWidth = targetHeight * srcRatio;
          dx = (targetWidth - dWidth) / 2;
        }
        ctx.drawImage(transformCanvas, 0, 0, transformCanvas.width, transformCanvas.height, dx, dy, dWidth, dHeight);
      }

      // Step 3: Precise KB Binary-Search Compression Algorithm
      let minQuality = 0.1;
      let maxQuality = 0.98;
      let bestDataUrl = finalCanvas.toDataURL(exportFormat, maxQuality);
      let bestSizeKB = Math.round((bestDataUrl.length * 3) / 4 / 1024);

      if (exportFormat !== 'image/png') {
        for (let i = 0; i < 10; i++) {
          const midQuality = (minQuality + maxQuality) / 2;
          const testDataUrl = finalCanvas.toDataURL(exportFormat, midQuality);
          const testSizeKB = Math.round((testDataUrl.length * 3) / 4 / 1024);

          if (testSizeKB <= targetKB) {
            bestDataUrl = testDataUrl;
            bestSizeKB = testSizeKB;
            minQuality = midQuality; // Search higher quality within limit
          } else {
            maxQuality = midQuality; // Reduce quality
          }
        }
      }

      setResizedImage(bestDataUrl);
      setResizedSizeKB(bestSizeKB);
      setOutputDimensions({ w: targetWidth, h: targetHeight });
    };
    img.src = rawImageSrc;
  }, [rawImageSrc, targetWidth, targetHeight, targetKB, rotation, zoom, cropOffset, resizeMode, exportFormat, bgColor]);

  // Re-process image whenever parameters change
  useEffect(() => {
    if (rawImageSrc) {
      processImage();
    }
  }, [rawImageSrc, processImage]);

  // Handle Preset Changes
  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    setIsCustom(false);
    const p = PRESETS.find((item) => item.id === presetId);
    if (p) {
      setCustomKB(p.targetKB);
      setCustomWidth(p.width);
      setCustomHeight(p.height);
      setCustomFilename(`sarkari_${p.id}`);
    }
  };

  // Drag to Pan inside Crop Box
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCropOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Download Handler with Clean Filename and Format
  const handleDownload = () => {
    if (!resizedImage) return;
    const ext = exportFormat === 'image/png' ? 'png' : exportFormat === 'image/webp' ? 'webp' : 'jpg';
    const finalName = (customFilename.trim() || 'sarkari_photo').replace(/\.[^/.]+$/, '');
    const downloadLink = document.createElement('a');
    downloadLink.href = resizedImage;
    downloadLink.download = `${finalName}_${targetWidth}x${targetHeight}_${resizedSizeKB}kb.${ext}`;
    downloadLink.click();
  };

  // Status Validation Check
  const isWithinLimits = resizedSizeKB >= minKB && resizedSizeKB <= targetKB;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Ad Unit */}
        <AdBanner format="leaderboard" slot="tools-top-leaderboard" />

        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 border border-blue-200/80 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-full text-xs font-bold shadow-xs">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            100% Free Sarkari Exam Utility &bull; Zero Server Upload
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Sarkari Photo, Signature &amp; Thumb Resizer Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Compress, crop, and adjust your passport photo and signature to exact KB and pixel dimensions for <strong>SSC, UPSC, RRB Railways, IBPS, SBI, and State Police</strong> online application forms without losing sharpness or clarity.
          </p>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Controls & Exam Presets (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Upload Area */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload size={18} className="text-blue-600 dark:text-blue-400" />
                  Step 1: Upload Your Image
                </h2>
                {rawImageSrc && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} /> Replace Image
                  </button>
                )}
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors duration-200 ${
                  rawImageSrc
                    ? 'border-blue-500/50 dark:border-indigo-500/40 bg-blue-50/20 dark:bg-slate-900/80'
                    : 'border-slate-300 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-slate-700 bg-slate-50/40 hover:bg-slate-100/50 dark:bg-slate-950/40 dark:hover:bg-slate-900/80'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Upload size={22} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block mb-0.5">
                    {rawImageSrc ? 'Click to Choose Different Photo' : 'Click to Upload Photo or Signature'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Supports JPG, JPEG, PNG, WEBP &bull; Max 25 MB
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {originalDimensions && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span>Original: <strong>{originalDimensions.w} x {originalDimensions.h} px</strong></span>
                  <span>File Size: <strong className="text-slate-800 dark:text-slate-200">{originalSizeKB} KB</strong></span>
                  <span>Format: <strong>{originalFile?.type.split('/')[1]?.toUpperCase()}</strong></span>
                </div>
              )}
            </div>

            {/* Step 2: Exam Preset & Dimensions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5 transition-colors">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders size={18} className="text-indigo-600 dark:text-indigo-400" />
                  Step 2: Select Exam Format
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {isCustom ? 'Switch to Exam Presets' : '🔧 Custom Dimensions'}
                </button>
              </div>

              {!isCustom ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESETS.map((preset) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetSelect(preset.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-colors duration-200 cursor-pointer relative group ${
                          isSelected
                            ? 'border-blue-600 dark:border-indigo-500/80 bg-blue-50/80 dark:bg-slate-850 shadow-xs ring-1 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-950/40 dark:hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {preset.category}
                          </span>
                          {isSelected && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                        </div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block truncate mb-0.5">
                          {preset.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                          Target: <strong>{preset.targetKB} KB</strong> &bull; {preset.width}x{preset.height}px
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Max KB Limit</label>
                      <input
                        type="number"
                        min="5"
                        max="5000"
                        value={customKB}
                        onChange={(e) => setCustomKB(Math.max(5, Number(e.target.value)))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Width (px)</label>
                      <input
                        type="number"
                        min="50"
                        max="3000"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Math.max(50, Number(e.target.value)))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Height (px)</label>
                      <input
                        type="number"
                        min="50"
                        max="3000"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Math.max(50, Number(e.target.value)))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Crop, Rotate & High-Quality Resampling Options */}
            {rawImageSrc && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5 transition-colors">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Crop size={18} className="text-emerald-600 dark:text-emerald-400" />
                  Step 3: Fine-Tune, Crop &amp; Resize Method
                </h2>

                {/* Resize Algorithm Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Resize Method (Zero Quality Compromise)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setResizeMode('fit-pad')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-colors duration-200 cursor-pointer ${
                        resizeMode === 'fit-pad'
                          ? 'border-blue-600 dark:border-indigo-500/80 bg-blue-50/80 dark:bg-slate-850 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-950/40 dark:hover:bg-slate-900/80 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Fit &amp; White Pad (Official)
                    </button>
                    <button
                      type="button"
                      onClick={() => setResizeMode('crop-fill')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-colors duration-200 cursor-pointer ${
                        resizeMode === 'crop-fill'
                          ? 'border-blue-600 dark:border-indigo-500/80 bg-blue-50/80 dark:bg-slate-850 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-950/40 dark:hover:bg-slate-900/80 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Smart Center Crop
                    </button>
                    <button
                      type="button"
                      onClick={() => setResizeMode('stretch')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-colors duration-200 cursor-pointer ${
                        resizeMode === 'stretch'
                          ? 'border-blue-600 dark:border-indigo-500/80 bg-blue-50/80 dark:bg-slate-850 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-950/40 dark:hover:bg-slate-900/80 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Exact Stretch
                    </button>
                  </div>
                </div>

                {/* Interactive Crop & Transform Toolbar */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Move size={14} className="text-blue-500" />
                      Adjust Crop &amp; Orientation
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Rotate 90° Counter-Clockwise"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Rotate 90° Clockwise"
                      >
                        <RotateCw size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRotation(0);
                          setZoom(1);
                          setCropOffset({ x: 0, y: 0 });
                        }}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1"><ZoomIn size={12} /> Zoom &amp; Scale</span>
                      <span>{(zoom * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Background Pad Color Selector */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Padding Background:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBgColor('#ffffff')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          bgColor === '#ffffff'
                            ? 'border-blue-600 bg-white text-slate-900 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        White (Standard)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBgColor('#000000')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          bgColor === '#000000'
                            ? 'border-blue-600 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        Black
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Interactive Preview & Download Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 transition-colors">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-emerald-500" />
                  Live Output Preview
                </h2>
                {resizedImage && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                      isWithinLimits
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isWithinLimits ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {isWithinLimits ? 'Exam Ready' : `${resizedSizeKB} KB`}
                  </span>
                )}
              </div>

              {resizedImage ? (
                <div className="space-y-5">
                  {/* Before & After Interactive Preview Display */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-center">
                      <div
                        className="relative rounded-2xl overflow-hidden bg-white border-2 border-emerald-500/60 shadow-md shadow-emerald-500/10 flex items-center justify-center p-1 cursor-move select-none"
                        style={{
                          width: `${Math.min(260, targetWidth)}px`,
                          height: `${Math.min(300, (targetHeight / targetWidth) * Math.min(260, targetWidth))}px`,
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        title="Click & Drag to Adjust Position"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resizedImage}
                          alt="Resized Sarkari Output"
                          className="max-h-full max-w-full object-contain pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Dimensions & Quality Badge */}
                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Output Dimensions</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {outputDimensions.w} x {outputDimensions.h} px
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Target File Size</span>
                        <span className={`text-xs font-black ${isWithinLimits ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                          {resizedSizeKB} KB <span className="text-[10px] text-slate-400">(Max {targetKB}KB)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Custom Filename & Format Selection */}
                  <div className="space-y-3 pt-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FileText size={14} className="text-blue-500" />
                      Output Filename &amp; Format
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customFilename}
                        onChange={(e) => setCustomFilename(e.target.value)}
                        placeholder="e.g. ssc_cgl_photo"
                        className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                      />
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                      >
                        <option value="image/jpeg">.JPG</option>
                        <option value="image/png">.PNG</option>
                        <option value="image/webp">.WEBP</option>
                      </select>
                    </div>
                  </div>

                  {/* High-Impact Download Button */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <Download size={18} />
                    Download Resized File ({resizedSizeKB} KB)
                  </button>

                  {/* Channel Community Hook */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-500/30 text-center space-y-2">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                      🚀 Never miss application deadlines for SSC &amp; Railways!
                    </span>
                    <a
                      href="https://t.me/formbharlo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all"
                    >
                      <Send size={13} /> Join Telegram Alerts
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    No Image Uploaded Yet
                  </span>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Upload your passport photo or signature on the left to see the live transformed preview and download instantly.
                  </p>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
                <span>100% Client-Side Privacy: Your documents never touch any remote server.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom In-Feed Ad Banner */}
        <AdBanner format="in-feed" slot="tools-bottom-infeed" />
      </div>
    </div>
  );
}
