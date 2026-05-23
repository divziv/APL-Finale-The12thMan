import { useState, useEffect, useCallback } from 'react';
import { Zone, Alert, CrowdMetrics, CCTVFeed } from '../types';
import { initialZones, alertTemplates, cctvFeeds } from '../data/mockData';

export function useZoneSimulation(interval: number = 3000) {
  const [zones, setZones] = useState<Zone[]>(initialZones);

  const updateZones = useCallback(() => {
    setZones(prevZones =>
      prevZones.map(zone => {
        const change = (Math.random() - 0.5) * 30;
        const newCount = Math.max(50, Math.min(zone.capacity, zone.currentCount + change));
        const percentage = newCount / zone.capacity;

        let newStatus = zone.status;
        if (percentage >= 0.95) newStatus = 'critical';
        else if (percentage >= 0.85) newStatus = 'congested';
        else if (percentage >= 0.7) newStatus = 'moderate';
        else newStatus = 'safe';

        return {
          ...zone,
          currentCount: Math.round(newCount),
          status: newStatus,
        };
      })
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(updateZones, interval);
    return () => clearInterval(timer);
  }, [interval, updateZones]);

  return { zones, setZones };
}

export function useAlertSimulation(zones: Zone[], interval: number = 5000) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const generateAlert = useCallback(() => {
    const criticalZones = zones.filter(z => z.status === 'critical' || z.status === 'congested');
    const shouldCreateAlert = Math.random() > 0.4;

    if (!shouldCreateAlert) return;

    let template;
    if (criticalZones.length > 0 && Math.random() > 0.5) {
      const zone = criticalZones[Math.floor(Math.random() * criticalZones.length)];
      template = {
        zoneId: zone.id,
        message: `${zone.name} is experiencing ${zone.status === 'critical' ? 'critical overcrowding' : 'high density'}`,
        severity: zone.status === 'critical' ? 'critical' as const : 'warning' as const,
      };
    } else {
      template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    }

    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      ...template,
      timestamp: new Date(),
      acknowledged: false,
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 20));
  }, [zones]);

  useEffect(() => {
    const timer = setInterval(generateAlert, interval);
    return () => clearInterval(timer);
  }, [interval, generateAlert]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return { alerts, acknowledgeAlert, clearAlerts };
}

export function useCrowdMetrics(zones: Zone[]) {
  const [metrics, setMetrics] = useState<CrowdMetrics>({
    totalCount: 0,
    activeAlerts: 0,
    safeZones: 0,
    congestedZones: 0,
    emergencyMode: false,
  });

  useEffect(() => {
    const totalCount = zones.reduce((sum, z) => sum + z.currentCount, 0);
    const safeZones = zones.filter(z => z.status === 'safe').length;
    const congestedZones = zones.filter(z => z.status === 'congested' || z.status === 'critical').length;
    const criticalCount = zones.filter(z => z.status === 'critical').length;

    setMetrics(prev => ({
      totalCount,
      activeAlerts: criticalCount,
      safeZones,
      congestedZones,
      emergencyMode: prev.emergencyMode,
    }));
  }, [zones]);

  const toggleEmergencyMode = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      emergencyMode: !prev.emergencyMode,
    }));
  }, []);

  return { metrics, toggleEmergencyMode };
}

export function useCCTVSimulation(interval: number = 2000) {
  const [feeds, setFeeds] = useState<CCTVFeed[]>(cctvFeeds);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeeds(prevFeeds =>
        prevFeeds.map(feed => {
          if (!feed.aiActive) return feed;

          const change = Math.floor((Math.random() - 0.5) * 20);
          return {
            ...feed,
            peopleCount: Math.max(50, Math.min(600, feed.peopleCount + change)),
            status: Math.random() > 0.95 ? 'online' : 'analyzing',
          };
        })
      );
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return feeds;
}
