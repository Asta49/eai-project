/**
 * VoiceProvider abstraction interface
 * Supports browser Web Speech API (demo-level) and stub adapters for Sarvam AI, Bhashini, AI4Bharat.
 */

export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export interface VoiceProvider {
  name: string;
  isSupported(): boolean;
  startListening(
    language: string,
    onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: string) => void
  ): () => void; // returns stop function
  speak(text: string, language: string, onEnd?: () => void): void;
  stopSpeaking(): void;
}

/**
 * Web Speech API implementation for client browsers
 */
export class BrowserWebSpeechProvider implements VoiceProvider {
  name = 'WebSpeechAPI';
  private synthesisUtterance: SpeechSynthesisUtterance | null = null;

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const hasSpeechRecognition =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    return hasSpeechRecognition && hasSpeechSynthesis;
  }

  private mapLangToBcp47(lang: string): string {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'te':
        return 'te-IN';
      case 'ta':
        return 'ta-IN';
      default:
        return 'en-IN';
    }
  }

  startListening(
    language: string,
    onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: string) => void
  ): () => void {
    if (typeof window === 'undefined') {
      onError('Browser environment required');
      return () => {};
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Web Speech Recognition API is not supported in this browser.');
      return () => {};
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = this.mapLangToBcp47(language);

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const transcript = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);
        const confidence = event.results[0]?.[0]?.confidence ?? 0.9;

        onResult({ transcript, isFinal, confidence });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        onError(event.error);
      };

      recognition.start();

      return () => {
        try {
          recognition.stop();
        } catch (_) {}
      };
    } catch (err: any) {
      onError(err.message || 'Failed to start speech recognition');
      return () => {};
    }
  }

  speak(text: string, language: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not available');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean markdown asterisks and citations for natural speech
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = this.mapLangToBcp47(language);
    utterance.rate = 0.95; // slightly slower for clinical clarity
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    this.synthesisUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

/**
 * Sarvam AI Voice Provider Stub
 * TODO: Plug in Sarvam AI Saarathi / Bulbul API key and endpoints for hyper-realistic Indic speech
 */
export class SarvamAIVoiceProvider implements VoiceProvider {
  name = 'SarvamAI';

  isSupported(): boolean {
    return false; // Stub: will be enabled when SARVAM_API_KEY is configured
  }

  startListening(
    _language: string,
    _onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: string) => void
  ): () => void {
    onError('Sarvam AI Speech-to-Text adapter not yet configured.');
    return () => {};
  }

  speak(_text: string, _language: string, onEnd?: () => void): void {
    console.info('Sarvam AI TTS stub invoked.');
    if (onEnd) onEnd();
  }

  stopSpeaking(): void {}
}

/**
 * Bhashini (National Language Translation Mission, India) Voice Provider Stub
 * TODO: Plug in Bhashini pipeline ID and inference API
 */
export class BhashiniVoiceProvider implements VoiceProvider {
  name = 'Bhashini';

  isSupported(): boolean {
    return false;
  }

  startListening(
    _language: string,
    _onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: string) => void
  ): () => void {
    onError('Bhashini Speech API stub.');
    return () => {};
  }

  speak(_text: string, _language: string, onEnd?: () => void): void {
    if (onEnd) onEnd();
  }

  stopSpeaking(): void {}
}

/**
 * AI4Bharat IndicWhisper & IndicTTS Provider Stub
 * TODO: Connect to IIT Madras AI4Bharat hosted models
 */
export class AI4BharatVoiceProvider implements VoiceProvider {
  name = 'AI4Bharat';

  isSupported(): boolean {
    return false;
  }

  startListening(
    _language: string,
    _onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: string) => void
  ): () => void {
    onError('AI4Bharat speech adapter stub.');
    return () => {};
  }

  speak(_text: string, _language: string, onEnd?: () => void): void {
    if (onEnd) onEnd();
  }

  stopSpeaking(): void {}
}

export function getVoiceProvider(): VoiceProvider {
  // In browser, default to WebSpeechProvider
  return new BrowserWebSpeechProvider();
}
