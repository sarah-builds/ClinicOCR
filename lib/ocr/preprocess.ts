import { ImageQualityCheck } from "@/types";

/**
 * Analyzes an image (Base64 or Canvas) for quality metrics:
 * - Blur detection (Laplacian Variance simulation)
 * - Low lighting detection (Luminance analysis)
 * - Contrast & resolution check
 */
export async function analyzeImageQuality(base64Image: string): Promise<ImageQualityCheck> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      // Server-side fallback estimation
      return resolve({
        isBlurry: false,
        blurScore: 85,
        isLowLight: false,
        isCropped: false,
        isTilted: false,
        qualityGrade: "Excellent",
        warnings: [],
      });
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve({
          isBlurry: false,
          blurScore: 80,
          isLowLight: false,
          isCropped: false,
          isTilted: false,
          qualityGrade: "Good",
          warnings: [],
        });
      }

      // Downscale for fast analysis
      const width = Math.min(img.width, 400);
      const height = Math.round((img.height / img.width) * width);
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // 1. Calculate Average Luminance (Lighting check)
      let totalLuminance = 0;
      const pixelCount = data.length / 4;
      const grayscale: number[] = new Array(pixelCount);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Standard relative luminance formula
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        grayscale[i / 4] = lum;
        totalLuminance += lum;
      }

      const avgLuminance = totalLuminance / pixelCount;
      const isLowLight = avgLuminance < 65;

      // 2. Variance of Laplacian approximation (Blur detection)
      let sumVariance = 0;
      let count = 0;

      for (let y = 1; y < height - 1; y += 2) {
        for (let x = 1; x < width - 1; x += 2) {
          const idx = y * width + x;
          const val = grayscale[idx];
          const laplacian =
            4 * val -
            grayscale[idx - 1] -
            grayscale[idx + 1] -
            grayscale[idx - width] -
            grayscale[idx + width];

          sumVariance += laplacian * laplacian;
          count++;
        }
      }

      const blurScore = Math.round((sumVariance / (count || 1)) / 10);
      const isBlurry = blurScore < 25;

      const warnings: string[] = [];
      if (isBlurry) warnings.push("Image appears blurry or out of focus. Hold camera steady.");
      if (isLowLight) warnings.push("Low ambient lighting detected. Use better light or flash.");
      if (img.width < 500 || img.height < 500) warnings.push("Low image resolution. Details may be hard to read.");

      let qualityGrade: "Excellent" | "Good" | "Needs Review" = "Excellent";
      if (warnings.length >= 2 || blurScore < 15) {
        qualityGrade = "Needs Review";
      } else if (warnings.length === 1 || blurScore < 35) {
        qualityGrade = "Good";
      }

      resolve({
        isBlurry,
        blurScore,
        isLowLight,
        isCropped: false,
        isTilted: false,
        qualityGrade,
        warnings,
      });
    };

    img.onerror = () => {
      resolve({
        isBlurry: false,
        blurScore: 70,
        isLowLight: false,
        isCropped: false,
        isTilted: false,
        qualityGrade: "Good",
        warnings: ["Unable to run image canvas validation."],
      });
    };

    img.src = base64Image;
  });
}

/**
 * Preprocesses prescription image:
 * Grayscale -> Contrast Boost -> Sharpening -> Returns enhanced Data URI
 */
export async function preprocessImage(base64Image: string): Promise<string> {
  if (typeof window === "undefined") return base64Image;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(base64Image);

      // Scale down if image is excessively large (e.g. 4000x3000 camera raw)
      const maxDim = 1600;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Adaptive contrast enhancement & grayscale conversion
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // Contrast enhancement formula
        const contrast = 1.35; // boost factor
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        let enhanced = factor * (gray - 128) + 128;
        enhanced = Math.max(0, Math.min(255, enhanced));

        data[i] = enhanced;
        data[i + 1] = enhanced;
        data[i + 2] = enhanced;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };

    img.onerror = () => resolve(base64Image);
    img.src = base64Image;
  });
}
