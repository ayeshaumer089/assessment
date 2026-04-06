// Utilities for capturing media (video and screen) and returning a Blob.
// These helpers prioritize clarity and reliable default behavior.

/**
 * Record a MediaStream for a fixed duration and return a Blob and the stream.
 * Caller should stop and release the stream when done (we do it here as well).
 */
export async function recordStream(stream, { durationMs = 4000, mimeType = 'video/webm;codecs=vp9,opus' } = {}) {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onerror = (e) => {
        stopTracks(stream);
        reject(e.error || new Error('Recording failed'));
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        stopTracks(stream);
        resolve({ blob, stream });
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop();
      }, durationMs);
    } catch (err) {
      stopTracks(stream);
      reject(err);
    }
  });
}

export async function recordUserVideo({ durationMs = 4000 } = {}) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Camera is not available in this browser');
  }
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  return recordStream(stream, { durationMs });
}

export async function recordScreen({ durationMs = 4000 } = {}) {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('Screen sharing is not supported in this browser');
  }
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  return recordStream(stream, { durationMs });
}

function stopTracks(stream) {
  try {
    stream.getTracks().forEach((t) => t.stop());
  } catch {}
}

