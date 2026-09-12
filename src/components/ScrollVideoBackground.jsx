import React, { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 241;

/**
 * True Frame-by-Frame Scroll Canvas Controller
 * 
 * Maps 0.00 -> 1.00 Page Scroll Progress directly to exact Frame 1 -> Frame 241.
 * Renders loaded image frame sequence directly to full-screen HTML5 Canvas.
 */
export default function ScrollVideoBackground() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedFlagsRef = useRef(new Array(TOTAL_FRAMES).fill(false));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetFrameIndex = 0;
    let renderedFrameIndex = -1;
    let ticking = false;

    // Helper: calculate total scrollable height
    const getScrollableHeight = () => {
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(
        body ? body.scrollHeight : 0,
        body ? body.offsetHeight : 0,
        html ? html.clientHeight : 0,
        html ? html.scrollHeight : 0,
        html ? html.offsetHeight : 0
      );
      return Math.max(1, docHeight - window.innerHeight);
    };

    // Calculate target frame index (0 to 240) based on page scroll progress
    const calculateTargetFrame = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = getScrollableHeight();
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      return Math.round(progress * (TOTAL_FRAMES - 1));
    };

    // Draw image to canvas using object-fit: cover
    const drawCoverImage = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      // Adjust canvas resolution for sharp display
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = displayWidth / displayHeight;

      let renderW, renderH, x, y;

      if (canvasRatio > imgRatio) {
        renderW = displayWidth;
        renderH = displayWidth / imgRatio;
        x = 0;
        y = (displayHeight - renderH) / 2;
      } else {
        renderH = displayHeight;
        renderW = displayHeight * imgRatio;
        x = (displayWidth - renderW) / 2;
        y = 0;
      }

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(img, x, y, renderW, renderH);
    };

    // Retrieve best available loaded frame if target index is loading
    const getBestLoadedFrame = (index) => {
      if (loadedFlagsRef.current[index] && imagesRef.current[index]) {
        return imagesRef.current[index];
      }

      // Search outward for closest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const lower = index - offset;
        const upper = index + offset;
        if (lower >= 0 && loadedFlagsRef.current[lower] && imagesRef.current[lower]) {
          return imagesRef.current[lower];
        }
        if (upper < TOTAL_FRAMES && loadedFlagsRef.current[upper] && imagesRef.current[upper]) {
          return imagesRef.current[upper];
        }
      }
      return null;
    };

    const render = () => {
      ticking = false;
      targetFrameIndex = calculateTargetFrame();

      const frameImage = getBestLoadedFrame(targetFrameIndex);
      if (frameImage) {
        drawCoverImage(frameImage);
        renderedFrameIndex = targetFrameIndex;

        // Debug verification logging
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const maxScroll = getScrollableHeight();
        const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
        console.debug(
          `[ScrollCanvas] Progress: ${progress.toFixed(3)} | Frame: ${targetFrameIndex + 1} / ${TOTAL_FRAMES}`
        );
      }
    };

    const requestRender = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    };

    // Preload frame images progressively
    const preloadFrames = () => {
      imagesRef.current = new Array(TOTAL_FRAMES);

      // Load Frame 1 immediately
      const firstImg = new Image();
      const firstSrc = `/media/frames/frame_0001.jpg`;
      firstImg.src = firstSrc;
      imagesRef.current[0] = firstImg;
      firstImg.onload = () => {
        loadedFlagsRef.current[0] = true;
        requestRender();
      };

      // Load remaining frames
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNum = String(i + 1).padStart(4, '0');
        img.src = `/media/frames/frame_${frameNum}.jpg`;
        imagesRef.current[i] = img;

        img.onload = () => {
          loadedFlagsRef.current[i] = true;
          if (i === targetFrameIndex || renderedFrameIndex === -1) {
            requestRender();
          }
        };
      }
    };

    preloadFrames();

    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender, { passive: true });
    window.addEventListener('wheel', requestRender, { passive: true });
    window.addEventListener('touchmove', requestRender, { passive: true });

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        requestRender();
      });
      resizeObserver.observe(document.body);
    }

    // Initial render
    requestRender();

    return () => {
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestRender);
      window.removeEventListener('wheel', requestRender);
      window.removeEventListener('touchmove', requestRender);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="app-background-video"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.55,
        filter: 'brightness(0.7) contrast(1.1)'
      }}
    />
  );
}
