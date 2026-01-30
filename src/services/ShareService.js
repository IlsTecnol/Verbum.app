export const ShareService = {
  generateImage: (text, reference) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 1080;
      canvas.height = 1080;
      
      // Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, '#2563eb'); // Blue 600
      gradient.addColorStop(1, '#9333ea'); // Purple 600
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);
      
      // Text
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      
      // Verse Text
      ctx.font = 'bold 48px Inter, sans-serif';
      const words = text.split(' ');
      let line = '';
      let y = 400;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 800 && n > 0) {
          ctx.fillText(line, 540, y);
          line = words[n] + ' ';
          y += 60;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 540, y);
      
      // Reference
      y += 100;
      ctx.font = '36px Inter, sans-serif';
      ctx.fillText(reference, 540, y);
      
      // Logo / Branding
      y = 900;
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('Powered by Verbum', 540, y);
      
      resolve(canvas.toDataURL('image/png'));
    });
  }
};
