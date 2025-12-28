// ============================================================================
// CoffeeTeam Pro - Speech-to-Text Service
// ============================================================================

type TranscriptCallback = (transcript: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;

class STTService {
    private recognition: any = null;
    private isRecording = false;
    private transcriptCallbacks: TranscriptCallback[] = [];
    private errorCallbacks: ErrorCallback[] = [];
    private silenceTimer: number | null = null;
    private maxRecordingTimer: number | null = null;

    constructor() {
        if (this.isSupported()) {
            this.initRecognition();
        }
    }

    isSupported(): boolean {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    private initRecognition(): void {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'he-IL';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const res = event.results[i];
                if (res.isFinal) {
                    finalTranscript += res[0].transcript;
                } else {
                    interimTranscript += res[0].transcript;
                }
            }

            const fullTranscript = finalTranscript + interimTranscript;
            if (fullTranscript.trim()) {
                this.notifyTranscript(fullTranscript, !!finalTranscript);
                this.resetSilenceTimer();
            }
        };

        this.recognition.onerror = (event: any) => {
            this.notifyError(event.error);
        };

        this.recognition.onend = () => {
            if (this.isRecording) {
                try {
                    this.recognition?.start();
                } catch (e) {
                    this.isRecording = false;
                }
            }
        };
    }

    async startRecording(): Promise<void> {
        if (this.isRecording) return;
        if (!this.isSupported()) {
            throw new Error('Speech recognition not supported');
        }

        this.recognition?.start();
        this.isRecording = true;

        // 30 second max timeout
        this.maxRecordingTimer = setTimeout(() => {
            this.stopRecording();
        }, 30000);

        // 5 second silence auto-stop
        this.resetSilenceTimer();
    }

    stopRecording(): void {
        if (!this.isRecording) return;

        this.isRecording = false;
        this.recognition?.stop();

        if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
        }

        if (this.maxRecordingTimer) {
            clearTimeout(this.maxRecordingTimer);
            this.maxRecordingTimer = null;
        }
    }

    private resetSilenceTimer(): void {
        if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
        }

        this.silenceTimer = setTimeout(() => {
            this.stopRecording();
        }, 5000);
    }

    onTranscript(callback: TranscriptCallback): () => void {
        this.transcriptCallbacks.push(callback);
        return () => {
            this.transcriptCallbacks = this.transcriptCallbacks.filter(cb => cb !== callback);
        };
    }

    onError(callback: ErrorCallback): () => void {
        this.errorCallbacks.push(callback);
        return () => {
            this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
        };
    }

    private notifyTranscript(transcript: string, isFinal: boolean): void {
        this.transcriptCallbacks.forEach(callback => {
            try {
                callback(transcript, isFinal);
            } catch (error) {
                console.error('[STT] Callback error:', error);
            }
        });
    }

    private notifyError(error: string): void {
        this.errorCallbacks.forEach(callback => {
            try {
                callback(error);
            } catch (err) {
                console.error('[STT] Callback error:', err);
            }
        });
    }

    getIsRecording(): boolean {
        return this.isRecording;
    }
}

export const sttService = new STTService();
