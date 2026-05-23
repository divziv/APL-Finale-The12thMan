/**
 * @file StadiumTicketingAndSwags.tsx
 * @description Advanced multi-functional sector managing online ticket booking, validation scans, and team merchandise/sport kits distributions.
 */

import React, { useState } from 'react';
import { BookedTicket, TurnstileGate, SwagItem } from '../types';
import { Ticket, QrCode, Tag, Sparkles, CheckCircle2, TrendingUp, ShoppingBag, Plus, Loader2, Award, ClipboardCheck, ArrowUpRight } from 'lucide-react';

interface StadiumTicketingAndSwagsProps {
  gates: TurnstileGate[];
  bookedTickets: BookedTicket[];
  onBookTicket: (ticket: Omit<BookedTicket, 'id' | 'timestamp' | 'qrCode' | 'status'>) => void;
  onVerifyTicket: (ticketId: string, destGateId: string, occupancyIncrease: number) => void;
  swags: SwagItem[];
  onDistributeSwag: (swagId: string, quantity: number) => void;
  onResetInventory: () => void;
  isVolunteerLoggedIn: boolean;
  activeRole: string;
}

export default function StadiumTicketingAndSwags({
  gates,
  bookedTickets,
  onBookTicket,
  onVerifyTicket,
  swags,
  onDistributeSwag,
  onResetInventory,
  isVolunteerLoggedIn,
  activeRole,
}: StadiumTicketingAndSwagsProps) {
  // Booking Form State
  const [holderName, setHolderName] = useState('');
  const [phone, setPhone] = useState('');
  const [section, setSection] = useState('Narendra Modi Astro Left');
  const [seatsCount, setSeatsCount] = useState(1);
  const [ticketClass, setTicketClass] = useState<'standard' | 'premium' | 'vip'>('standard');
  const [selectedGateId, setSelectedGateId] = useState(gates[0]?.id || 'g1');
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  // Volunteer scanner simulated delay state
  const [processingScanId, setProcessingScanId] = useState<string | null>(null);

  // Swag distribution helper quantity
  const [disburseQuantity, setDisburseQuantity] = useState<number>(25);

  const getPrice = () => {
    switch (ticketClass) {
      case 'standard': return 15;
      case 'premium': return 45;
      case 'vip': return 140;
    }
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName.trim()) return;

    onBookTicket({
      holderName,
      phone: phone || '+91 94520 XXXXX',
      section: `${section} [${ticketClass.toUpperCase()}]`,
      seatsCount,
      price: getPrice() * seatsCount,
      gateId: selectedGateId,
    });

    setBookingStatus(`🎉 Booking Successful! Reserved ${seatsCount} seats.`);
    setHolderName('');
    setPhone('');
    
    setTimeout(() => {
      setBookingStatus(null);
    }, 4000);
  };

  const triggerScanCheckIn = (ticket: BookedTicket) => {
    if (ticket.status === 'verified') return;
    setProcessingScanId(ticket.id);

    // Simulate laser scanning handshake check
    setTimeout(() => {
      onVerifyTicket(ticket.id, ticket.gateId, ticket.seatsCount);
      setProcessingScanId(null);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-6" id="ticketing-swags-portal">
      
      {/* Tab Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
            TICKET_ENGINE_V2_ONLINE
          </span>
          <h2 className="text-base font-bold text-white mt-1.5 uppercase font-sans tracking-wide">
            Ticket Office & Kit Deployment Terminal
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          SYSTEM_ACCESS: <span className="text-emerald-400 font-bold uppercase">{activeRole === 'volunteer' ? '👮 Volunteers Portal' : `🔓 Role: ${activeRole.toUpperCase()}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Column 1: Online Ticket Booking Form (4 cols) */}
        <div className="xl:col-span-4 bg-slate-950 p-4 border border-slate-850 rounded-lg flex flex-col gap-4">
          <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2.5">
            <Ticket className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest">
              Online Guest Ticket Booking
            </span>
          </div>

          <form onSubmit={handleBookSubmit} className="flex flex-col gap-3 text-xs" id="booking-submit-form">
            <div className="flex flex-col gap-1">
              <label htmlFor="holder-name-input" className="text-slate-400 font-bold">Attendee Display Name</label>
              <input
                id="holder-name-input"
                type="text"
                placeholder="Virat Shrinivasan"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded p-2 text-slate-100 outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="holder-phone-input" className="text-slate-400 font-bold">Contact Number / OTP Code</label>
              <input
                id="holder-phone-input"
                type="text"
                placeholder="+91 94520 88201"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded p-2 text-slate-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="ticket-class-dropdown" className="text-slate-400 font-bold">Seating Class</label>
                <select
                  id="ticket-class-dropdown"
                  value={ticketClass}
                  onChange={(e) => {
                    setTicketClass(e.target.value as any);
                    if (e.target.value === 'vip') {
                      setSection('VIP President Vault');
                      setSelectedGateId('g3');
                    } else if (e.target.value === 'premium') {
                      setSection('East Adani Pavilion');
                    } else {
                      setSection('Astro North Stand');
                    }
                  }}
                  className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded p-2 text-slate-200 cursor-pointer"
                >
                  <option value="standard">Standard ($15)</option>
                  <option value="premium">Premium ($45)</option>
                  <option value="vip">VIP Pavilion ($140)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="seats-count-dropdown" className="text-slate-400 font-bold">Seats (Unit)</label>
                <select
                  id="seats-count-dropdown"
                  value={seatsCount}
                  onChange={(e) => setSeatsCount(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded p-2 text-slate-200 cursor-pointer"
                >
                  <option value="1">1 Ticket</option>
                  <option value="2">2 Tickets</option>
                  <option value="3">3 Tickets</option>
                  <option value="4">4 Tickets</option>
                  <option value="6">6 Block Seats</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="gate-assignment-dropdown" className="text-slate-400 font-bold">Entry Gate Checkpoint</label>
              <select
                id="gate-assignment-dropdown"
                value={selectedGateId}
                onChange={(e) => setSelectedGateId(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded p-2 text-slate-200 cursor-pointer"
              >
                {gates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name.split(' ')[0]} G.{g.id.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Fare calculation review */}
            <div className="bg-slate-900 p-2.5 rounded border border-slate-850 font-mono text-[10px] mt-1 flex justify-between items-center text-slate-400">
              <span>Fare: <b>{seatsCount} x ${getPrice()}</b></span>
              <span className="text-cyan-400 font-extrabold text-sm">${seatsCount * getPrice()} USD</span>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-extrabold rounded select-none cursor-pointer tracking-wider hover:brightness-110 active:scale-95 transition-all text-xs"
            >
              GENERATE DIGITAL QR TICKET
            </button>
          </form>

          {/* Status receipt toast */}
          {bookingStatus && (
            <div className="bg-emerald-950/70 border border-emerald-800 px-3 py-2.5 rounded text-emerald-300 font-semibold text-[11px] flex items-start gap-2 animate-fadeIn mt-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{bookingStatus}</span>
            </div>
          )}
        </div>

        {/* Column 2: Digital Ticket Verification Queue (4 cols) */}
        <div className="xl:col-span-4 bg-slate-950 p-4 border border-slate-850 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest">
                  Verify & Validations Desk
                </span>
              </div>
              <span className="bg-slate-905 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-500 border border-emerald-950">
                PENDING: {bookedTickets.filter(t => t.status === 'pending').length}
              </span>
            </div>

            <p className="text-[10px] text-slate-450 mb-3 leading-relaxed font-mono">
              [SYSTEM DIAGNOSTICS] Authenticates digital QR signatures on-foot. Validating incrementation automatically maps spectators into actual checkout counters.
            </p>

            {/* Ticket listing */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-1" id="scanners-ticket-list">
              {bookedTickets.length === 0 ? (
                <div className="text-center py-12 text-slate-600 font-mono text-[10px]">
                  No tickets booked yet. Book above to generate ticket cards to verify!
                </div>
              ) : (
                bookedTickets.map((tc) => {
                  const gateLabel = gates.find(g => g.id === tc.gateId)?.name.split('(')[0] || tc.gateId;
                  const isPending = tc.status === 'pending';

                  return (
                    <div
                      key={tc.id}
                      className={`p-2.5 rounded border transition-all text-xs font-mono flex items-center justify-between gap-2.5 ${
                        isPending 
                          ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                          : 'bg-emerald-950/20 border-emerald-950 text-slate-450'
                      }`}
                    >
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`}></span>
                          <span className="font-extrabold text-slate-350 truncate block">
                            {tc.holderName}
                          </span>
                        </div>
                        <div className="text-[8px] text-slate-500 mt-1 flex flex-col gap-0.5">
                          <span>SEATS: <b>{tc.seatsCount}</b> ({tc.section.split('[')[0]})</span>
                          <span className="truncate">ZONE: {gateLabel}</span>
                        </div>
                      </div>

                      {isPending ? (
                        <button
                          onClick={() => triggerScanCheckIn(tc)}
                          disabled={processingScanId !== null}
                          className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[9px] rounded uppercase cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                        >
                          {processingScanId === tc.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-slate-950" />
                              <span>Scanning</span>
                            </>
                          ) : (
                            <>
                              <QrCode className="w-3 h-3 text-slate-950" />
                              <span>Verify</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[8px] font-bold text-emerald-450 flex items-center gap-1 uppercase bg-emerald-950 border border-emerald-900 bg-emerald-950/50 px-1 py-0.5 rounded shrink-0">
                          <ClipboardCheck className="w-3 h-3 text-emerald-400" />
                          <span>Approved</span>
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-slate-900/60 p-2 border border-slate-850 rounded text-[9px] text-slate-500 font-mono mt-3 text-center">
            Handheld ticket sync with: <span className="text-cyan-400">CAPACITOR-BLE-QR-V3</span>
          </div>
        </div>

        {/* Column 3: Swags and Kit Distribution Dashboard (4 cols) */}
        <div className="xl:col-span-4 bg-slate-950 p-4 border border-slate-850 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest">
                  Swags, Badges & Kits Manager
                </span>
              </div>
              
              <button
                type="button"
                onClick={onResetInventory}
                className="text-[9px] font-mono text-cyan-500 hover:underline hover:text-cyan-400 cursor-pointer"
              >
                Reset Stock
              </button>
            </div>

            <p className="text-[10px] text-slate-450 leading-relaxed font-sans mb-3 text-slate-400">
              Each turnstile gate hosts a distribution stand. Ensure active fans receive their flags and kit caps correctly as they checked in!
            </p>

            {/* List of Swags */}
            <div className="flex flex-col gap-3">
              {swags.map((sw) => {
                const percRemaining = Math.max(0, Math.round((sw.stockRemaining / 600) * 100));
                
                return (
                  <div key={sw.id} className="bg-slate-900 border border-slate-850 p-3 rounded-md font-mono text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-200">{sw.name}</span>
                      <span className="text-[10px] text-cyan-400 font-extrabold">{sw.totalDistributed} sent</span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-955 rounded overflow-hidden mb-1.5 border border-slate-850">
                      <div
                        style={{ width: `${percRemaining}%` }}
                        className={`h-full rounded ${percRemaining < 15 ? 'bg-red-500' : percRemaining < 45 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-505">
                      <span>Stock: <b>{sw.stockRemaining} units left</b></span>
                      
                      {/* Distribute actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onDistributeSwag(sw.id, 25)}
                          disabled={sw.stockRemaining <= 0}
                          className="px-2 py-0.5 bg-slate-950 text-[8px] font-bold text-slate-300 border border-slate-800 hover:border-slate-705 rounded hover:bg-slate-900 cursor-pointer"
                        >
                          Send 25
                        </button>
                        <button
                          onClick={() => onDistributeSwag(sw.id, 100)}
                          disabled={sw.stockRemaining <= 0}
                          className="px-2 py-0.5 bg-cyan-950 text-[8.5px] font-bold text-cyan-300 border border-cyan-850 rounded hover:bg-cyan-900 cursor-pointer"
                        >
                          Send 100
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 p-2.5 rounded border border-slate-850 text-center font-mono mt-3">
            <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Total Handouts Disbursed</span>
            <span className="text-sm font-extrabold text-white mt-1 block">
              {swags.reduce((acc, current) => acc + current.totalDistributed, 0).toLocaleString()} Units Supplied
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
