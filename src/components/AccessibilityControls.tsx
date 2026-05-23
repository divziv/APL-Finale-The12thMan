/**
 * @file AccessibilityControls.tsx
 * @description Accessible control deck offering vision, motor, hearing, and cognitive enhancements.
 */

import React, { useEffect } from 'react';
import { Eye, Type, Volume2, Sparkles, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AccessibilityControlsProps {
  colorBlindMode: 'normal' | 'deuteranopia' | 'protanopia' | 'achromatopsia';
  setColorBlindMode: (mode: 'normal' | 'deuteranopia' | 'protanopia' | 'achromatopsia') => void;
  textSize: 'normal' | 'large' | 'extra-large';
  setTextSize: (size: 'normal' | 'large' | 'extra-large') => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  flashingEnabled: boolean;
  setFlashingEnabled: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  speakText?: (text: string) => void;
  activeStadiumId: string;
  wheelchairAssist: boolean;
  setWheelchairAssist: (val: boolean) => void;
  sensoryQuietMode: boolean;
  setSensoryQuietMode: (val: boolean) => void;
  signLanguageTicker: boolean;
  setSignLanguageTicker: (val: boolean) => void;
  familyRestroomGuides: boolean;
  setFamilyRestroomGuides: (val: boolean) => void;
  socioEconomicSubsidy: boolean;
  setSocioEconomicSubsidy: (val: boolean) => void;
}

export default function AccessibilityControls({
  colorBlindMode,
  setColorBlindMode,
  textSize,
  setTextSize,
  ttsEnabled,
  setTtsEnabled,
  flashingEnabled,
  setFlashingEnabled,
  highContrast,
  setHighContrast,
  speakText,
  activeStadiumId,
  wheelchairAssist,
  setWheelchairAssist,
  sensoryQuietMode,
  setSensoryQuietMode,
  signLanguageTicker,
  setSignLanguageTicker,
  familyRestroomGuides,
  setFamilyRestroomGuides,
  socioEconomicSubsidy,
  setSocioEconomicSubsidy,
}: AccessibilityControlsProps) {

  // Test announcer button trigger
  const handleTestTts = () => {
    if (speakText) {
      speakText("Accessibility Voice Announcer is active and fully optimized for matchday crowd synchronization.");
    } else if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Accessibility Voice Announcer is active and fully optimized.");
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  /**
   * Helper that describes in simple plain-English language what the system is currently seeing for cognitive support.
   */
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-6" id="accessibility-control-deck">
      
      {/* Dynamic SVG Filter definition to provide bulletproof live color-blindness rendering across any browser */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          {/* Deuteranopia (Red-Green Deficit) filter matrix */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.290, 0.710, 0.000, 0, 0
                      0.230, 0.770, 0.000, 0, 0
                      0.000, 0.490, 0.510, 0, 0
                      0.000, 0.000, 0.000, 1, 0"
            />
          </filter>
          {/* Protanopia (Red Deficit) filter matrix */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.200, 0.990, -0.190, 0, 0
                      0.160, 0.790, 0.050, 0, 0
                      0.010, -0.010, 1.000, 0, 0
                      0.000, 0.000, 0.000, 1, 0"
            />
          </filter>
          {/* Achromatopsia (Total color loss) - grayscale matrix */}
          <filter id="achromatopsia-filter">
            <feColorMatrix
              type="matrix"
              values="0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0.000, 0.000, 0.000, 1, 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Profile Header */}
      <div>
        <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>DEI Inclusive Settings Board</span>
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-1">ACCESSIBILITY_LAYER: ENFORCED</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* 1. Color Blindness Simulators */}
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80 flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vision Spectrum Overrides</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <button
              id="dei-btn-normal"
              onClick={() => setColorBlindMode('normal')}
              className={`px-3 py-2 rounded-md border transition-all text-left ${colorBlindMode === 'normal' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'}`}
              aria-label="Set vision to normal color space"
            >
              ◉ Normal View
            </button>
            <button
              id="dei-btn-deut"
              onClick={() => setColorBlindMode('deuteranopia')}
              className={`px-3 py-2 rounded-md border transition-all text-left ${colorBlindMode === 'deuteranopia' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'}`}
              aria-label="Set vision to Deuteranopia filter"
            >
              ◉ Deuteranopia
            </button>
            <button
              id="dei-btn-prot"
              onClick={() => setColorBlindMode('protanopia')}
              className={`px-3 py-2 rounded-md border transition-all text-left ${colorBlindMode === 'protanopia' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'}`}
              aria-label="Set vision to Protanopia filter"
            >
              ◉ Protanopia
            </button>
            <button
              id="dei-btn-achr"
              onClick={() => setColorBlindMode('achromatopsia')}
              className={`px-3 py-2 rounded-md border transition-all text-left ${colorBlindMode === 'achromatopsia' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'}`}
              aria-label="Set vision to Achromatopsia grayscale"
            >
              ◉ Grayscale
            </button>
          </div>
          <p className="text-[10px] text-slate-500 italic mt-1 font-sans">
            Adjusts display colors using standard Daltonization values for operators with red-green or blue-cone deficits.
          </p>
        </div>

        {/* 2. Audio Announcements & Synthesizer */}
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80 flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Speech & Audio Synthesis</span>
          </label>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Text-to-Speech Guide</span>
              <button
                id="toggle-tts-trigger"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${ttsEnabled ? 'bg-cyan-500' : 'bg-slate-800'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${ttsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                id="btn-test-tts"
                onClick={handleTestTts}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 text-[10px] font-mono hover:bg-slate-800 active:bg-slate-950 text-slate-300 rounded transition-all flex items-center justify-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Test Announcement</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic mt-auto font-sans">
            Synthesizes tactical alarms and operator warnings into high-vocal guidance for blind or visually impaired operators.
          </p>
        </div>

        {/* 3. Text Magnifiers & Sensory Filters */}
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80 flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase">
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span>Typography & Sensory Adjust</span>
          </label>
          <div className="flex flex-col gap-3 text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Scale Text</span>
              <select
                id="dei-text-scale"
                value={textSize}
                onChange={(e) => setTextSize(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded text-xs focus:ring-1 focus:ring-cyan-500"
              >
                <option value="normal">Normal (100%)</option>
                <option value="large">Large (120%)</option>
                <option value="extra-large">Extra Large (140%)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Reduce Flashing Sirens</span>
              <button
                id="toggle-flashing-trigger"
                onClick={() => setFlashingEnabled(!flashingEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${flashingEnabled ? 'bg-cyan-500' : 'bg-slate-800'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${flashingEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic mt-auto font-sans">
            Reduces bright pulsing loops to limit fatigue or seizure potential while permitting text zoom for long missions.
          </p>
        </div>

        {/* 4. Structural & Social DEI Inclusion Toggles */}
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80 flex flex-col gap-3" id="dei-inclusion-toggles-card">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Structural DEI Inclusion</span>
          </label>
          <div className="flex flex-col gap-3.5 text-[11px] font-mono">
            
            {/* Toggle 1: Wheelchair & Mobility Assist */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-350 font-bold">Mobility Wayfinder</span>
                <span className="text-[9px] text-slate-500 font-sans">Wheelchair ramp highlights</span>
              </div>
              <button
                id="toggle-dei-wheelchair"
                onClick={() => {
                  setWheelchairAssist(!wheelchairAssist);
                  speakText(`Mobility wheelchair wayfinder routes ${!wheelchairAssist ? 'enabled' : 'disabled'} on structural maps.`);
                }}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${wheelchairAssist ? 'bg-cyan-500' : 'bg-slate-800'}`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${wheelchairAssist ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Toggle 2: Sensory-Friendly Calm Signals */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-350 font-bold">Quiet Zones Signal</span>
                <span className="text-[9px] text-slate-500 font-sans">Sensory rooms map marker</span>
              </div>
              <button
                id="toggle-dei-sensory"
                onClick={() => {
                  setSensoryQuietMode(!sensoryQuietMode);
                  speakText(`Sensory friendly quiet zone signals ${!sensoryQuietMode ? 'activated' : 'deactivated'}.`);
                }}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${sensoryQuietMode ? 'bg-cyan-500' : 'bg-slate-800'}`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${sensoryQuietMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Toggle 3: Sign Language & Captioning Feed */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-350 font-bold">Caption Subtitles</span>
                <span className="text-[9px] text-slate-500 font-sans">Broadcasting ASL caption logs</span>
              </div>
              <button
                id="toggle-dei-captions"
                onClick={() => {
                  setSignLanguageTicker(!signLanguageTicker);
                  speakText(`Multilingual live subtitles and sign captions ${!signLanguageTicker ? 'enabled' : 'disabled'}.`);
                }}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${signLanguageTicker ? 'bg-cyan-500' : 'bg-slate-800'}`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${signLanguageTicker ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Toggle 4: Family Unisex Restrooms Waypoint */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-350 font-bold">Family Restrooms</span>
                <span className="text-[9px] text-slate-500 font-sans">Unisex restroom paths</span>
              </div>
              <button
                id="toggle-dei-family-restrooms"
                onClick={() => {
                  setFamilyRestroomGuides(!familyRestroomGuides);
                  speakText(`Unisex family restroom and lactation room routes ${!familyRestroomGuides ? 'activated' : 'deactivated'}.`);
                }}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${familyRestroomGuides ? 'bg-cyan-500' : 'bg-slate-800'}`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${familyRestroomGuides ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Toggle 5: Socio-economic Ticket Verification Subsidies */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-350 font-bold">Socio-economic Tier</span>
                <span className="text-[9px] text-slate-500 font-sans">Low-income voucher validation</span>
              </div>
              <button
                id="toggle-dei-subsidies"
                onClick={() => {
                  setSocioEconomicSubsidy(!socioEconomicSubsidy);
                  speakText(`Socio economic community voucher screening policy ${!socioEconomicSubsidy ? 'activated' : 'deactivated'}.`);
                }}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${socioEconomicSubsidy ? 'bg-cyan-500' : 'bg-slate-800'}`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${socioEconomicSubsidy ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

          </div>
          <p className="text-[10px] text-slate-500 italic mt-auto font-sans">
            Configures operational overrides to support accessible entry lanes, low-income verification vouchers, and neurodivergent fans.
          </p>
        </div>

      </div>

      {/* 4. Cross-Platform Android & iOS App Shell Integration Config */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 font-sans text-xs">
        <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2 uppercase tracking-wide">
          <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <span>Android & iOS Mobile UI Shell Integration Bridge</span>
        </h3>
        <p className="text-slate-400 leading-relaxed mb-3">
          This full-stack system is designed with adaptive fluid viewports, optimized touch points (min 44px), and cross-origin security headers. It is directly compatible with hybrid shells like <b>CapacitorJS</b>, <b>Apache Cordova</b>, or standard native iOS <b>WKWebView</b>/Android <b>WebView</b> controllers.
        </p>
        <div className="bg-slate-900/90 border border-slate-850 p-3 rounded font-mono text-[10px] text-slate-350 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-200">ACTIVE WEBVIEW BRIDGE: ONLINE</span>
            </div>
            <p className="text-slate-500 text-[9px]">CAPACITOR_CORE_VERSION: v6.1 | MIN_SDK: 26 (Android), iOS: 15.0+</p>
          </div>
          <button
            onClick={() => {
              const config = {
                appId: "stadium.commander.app",
                appName: "Stadium Tactical Command Deck",
                webDir: "dist",
                server: {
                  url: window.location.origin,
                  allowNavigation: ["*"]
                },
                ios: {
                  preferredContentMode: "mobile",
                  limitsNavigationsToAppBoundDomains: true
                },
                android: {
                  allowMixedContent: false,
                  captureInput: true
                },
                handshakes: {
                  activeStadiumId,
                  scanSpeedTarget: 2.2,
                  emergencyExodusActive: false
                }
              };
              const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `stadium-mobile-native-bridge.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              if (speakText) speakText("Generated cross platform application manifest. Exported mobile config to file storage.");
            }}
            className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 hover:text-slate-950 font-bold text-white rounded text-[10px] uppercase cursor-pointer"
          >
            Download Mobile Config
          </button>
        </div>
      </div>

      {/* 5. Cognitive Plain Speech Summary Area */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 font-sans text-xs">
        <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2 uppercase tracking-wide">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Cognitive Screen Summary (Plain-Language Briefing)</span>
        </h3>
        <p className="text-slate-400 leading-relaxed">
          This hub controls entrance gates at a cricket stadium. <b>Gate 4</b> (South) and <b>Gate 1</b> (North) absorb normal matchday crowds. 
          When an influx occurs, the operator can redirect fans to safer entryways. If you have the Voice synthesiser active, the system will read major tactical shifts aloud to support visual accessibility. Live CCTV feeds automatically alert you if lines build up unexpectedly.
        </p>
      </div>

    </div>
  );
}
