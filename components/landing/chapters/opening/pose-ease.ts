// Monotone cubic interpolation preserves authored poses and joins their
// velocities without rounding off mandatory edge/back checkpoints.
export function poseEase(points: readonly { at: number; value: number }[], segment: number) {
  const slopes = points.slice(1).map((p, i) => (p.value - points[i].value) / (p.at - points[i].at));
  const tangent = (i: number) => {
    if (i === 0 || i === points.length - 1) return 0;
    const a = slopes[i - 1], b = slopes[i];
    if (a * b <= 0) return 0;
    const before = points[i].at - points[i - 1].at;
    const after = points[i + 1].at - points[i].at;
    const w1 = 2 * after + before, w2 = after + 2 * before;
    return (w1 + w2) / (w1 / a + w2 / b);
  };
  const delta = points[segment + 1].value - points[segment].value;
  if (delta === 0) return (t: number) => t;
  const duration = points[segment + 1].at - points[segment].at;
  const start = tangent(segment) * duration / delta;
  const end = tangent(segment + 1) * duration / delta;
  return (t: number) => (-2 * t ** 3 + 3 * t ** 2) + (t ** 3 - 2 * t ** 2 + t) * start + (t ** 3 - t ** 2) * end;
}
