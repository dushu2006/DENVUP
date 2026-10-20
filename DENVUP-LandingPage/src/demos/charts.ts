/**
 * Chart demonstrations.
 *
 * The only data shown here is the studio's own verifiable figures: the number
 * of people, the number of service lines, and the size of the technique
 * library. Nothing is estimated or invented.
 */

import { el } from '../core/dom';
import { gsap } from '../core/motion';
import { button, controls, hint, stage } from './helpers';
import type { Demo } from './types';

const barChart: Demo = {
  id: 'charts-bars',
  title: 'Chart enters with its bars growing',
  category: 'story',
  summary: 'Real studio figures, animated in from zero when the panel comes into view.',
  trigger: 'Automatic on entry, or press Replay',
  techniques: [315, 316],
  keywords: 'chart bars data grow counters numbers',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--chart');
    const chart = el('div', 'demo__chart');
    const data = [
      { label: 'People in the studio', value: 4 },
      { label: 'Service lines', value: 6 },
      { label: 'Process stages', value: 5 },
      { label: 'Techniques covered', value: 480 },
    ];
    const bars: HTMLElement[] = [];
    data.forEach((row) => {
      const item = el('div', 'demo__chart-row');
      const label = el('span', 'demo__chart-label');
      label.textContent = row.label;
      const track = el('span', 'demo__chart-track');
      const fill = el('span', 'demo__chart-fill');
      const value = el('span', 'demo__chart-value');
      value.textContent = '0';
      track.appendChild(fill);
      item.append(label, track, value);
      chart.appendChild(item);
      bars.push(fill);
      item.dataset.target = String(row.value);
    });
    wrap.appendChild(chart);

    const play = () => {
      const max = 480;
      bars.forEach((fill, i) => {
        const row = fill.parentElement!.parentElement!;
        const target = Number(row.dataset.target ?? 0);
        const output = row.querySelector<HTMLElement>('.demo__chart-value')!;
        const proxy = { v: 0 };
        if (reduced) {
          fill.style.width = `${(target / max) * 100}%`;
          output.textContent = String(target);
          return;
        }
        gsap.to(proxy, {
          v: target,
          duration: 1.1,
          delay: i * 0.09,
          ease: 'power2.out',
          onUpdate: () => {
            fill.style.width = `${(proxy.v / max) * 100}%`;
            output.textContent = Math.round(proxy.v).toString();
          },
        });
      });
    };
    play();

    const bar = controls(root);
    bar.appendChild(button('Replay', play));
    hint(root, 'Figures are the studio’s own: four people, six services, five stages, 480 techniques.');
  },
};

const lineChart: Demo = {
  id: 'charts-line',
  title: 'Line chart drawn from the same figures',
  category: 'story',
  summary: 'The same data rendered as a line, with the axis drawn in as it goes.',
  trigger: 'Automatic on entry, or press Replay',
  techniques: [315],
  keywords: 'line chart svg axes draw data',
  mount({ root, reduced }) {
    const wrap = stage(root, 'demo__stage--chart');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 320 160');
    svg.setAttribute('class', 'demo__chart-svg');
    const values = [4, 6, 5, 480];
    const max = 480;
    const points = values.map((value, i) => {
      const x = 24 + (i / (values.length - 1)) * 272;
      const y = 132 - (value / max) * 104;
      return { x, y, value };
    });
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'demo__chart-line');
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', `${d} L296 132 L24 132 Z`);
    area.setAttribute('class', 'demo__chart-area');
    svg.append(area, path);
    points.forEach((p) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', String(p.x));
      dot.setAttribute('cy', String(p.y));
      dot.setAttribute('r', '4');
      dot.setAttribute('class', 'demo__chart-dot');
      svg.appendChild(dot);
    });
    wrap.appendChild(svg);

    const play = () => {
      const length = path.getTotalLength?.() ?? 0;
      if (!length) return;
      if (reduced) {
        gsap.set(path, { strokeDasharray: 'none', strokeDashoffset: 0 });
        return;
      }
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' },
      );
      gsap.fromTo(svg.querySelectorAll('.demo__chart-dot'), { scale: 0, transformOrigin: '50% 50%' }, {
        scale: 1,
        duration: 0.4,
        stagger: 0.12,
        delay: 0.5,
        ease: 'back.out(2)',
      });
    };
    play();
    const bar = controls(root);
    bar.appendChild(button('Replay', play));
  },
};

export const chartDemos: Demo[] = [barChart, lineChart];
