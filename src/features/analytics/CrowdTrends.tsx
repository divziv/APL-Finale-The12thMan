import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useEngineStore } from '../../stores/useEngineStore';
import { TrendingUp } from 'lucide-react';

export default function CrowdTrends() {
  const d3Container = useRef<SVGSVGElement>(null);
  const globalOccupancy = useEngineStore(state => state.globalOccupancy);

  useEffect(() => {
    if (d3Container.current) {
      // Mock data for the sparkline
      const data = Array.from({ length: 20 }, () => Math.floor(Math.random() * 50) + 100);
      data.push(globalOccupancy > 0 ? globalOccupancy / 1000 : 150); // Add real scaled data at the end

      const svg = d3.select(d3Container.current);
      svg.selectAll('*').remove(); // Clear prev

      const width = 300;
      const height = 100;
      const margin = { top: 10, right: 10, bottom: 20, left: 20 };

      const x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data) as number * 1.2])
        .range([height - margin.bottom, margin.top]);

      const line = d3.line<number>()
        .curve(d3.curveMonotoneX)
        .x((d, i) => x(i))
        .y(d => y(d));

      // Area gradient
      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.6);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0);

      const area = d3.area<number>()
        .curve(d3.curveMonotoneX)
        .x((d, i) => x(i))
        .y0(height - margin.bottom)
        .y1(d => y(d));

      svg.append('path')
        .datum(data)
        .attr('fill', 'url(#area-gradient)')
        .attr('d', area);

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#06b6d4')
        .attr('stroke-width', 2)
        .attr('d', line);
      
      // Live dot at the end
      svg.append('circle')
        .attr('cx', x(data.length - 1))
        .attr('cy', y(data[data.length - 1]))
        .attr('r', 4)
        .attr('fill', '#22d3ee')
        .attr('class', 'animate-ping');
    }
  }, [globalOccupancy]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      <h3 className="text-cyan-400 font-mono text-xs font-bold uppercase mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Live Crowd Flow Kinetics
      </h3>
      <svg ref={d3Container} viewBox="0 0 300 100" className="w-full h-[100px]" preserveAspectRatio="none" />
      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-500">
        D3.js Sparkline
      </div>
    </div>
  );
}
