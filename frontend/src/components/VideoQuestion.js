import React, { useState, useRef, useEffect } from 'react';

function VideoQuestion({ setCurrentAnswer }) {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscription(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
  if(event.error === 'network') {
    console.warn('Network error in speech recognition. Try speaking again or check connection.');
  } else {
    console.error('Speech recognition error:', event.error);
  }
};

    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    setCurrentAnswer(transcription);
  }, [transcription, setCurrentAnswer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        streamRef.current.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }

    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Error accessing camera/microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsRecording(false);
  };

  const resetRecording = () => {
    setVideoBlob(null);
    setTranscription('');
    setCurrentAnswer('');
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ position: 'relative', width: '400px', height: '300px' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            width: '100%',
            height: '100%',
            border: '2px solid #ccc',
            borderRadius: '10px',
            backgroundColor: '#f0f0f0'
          }}
        />
        {isRecording && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'red',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            ● REC
          </div>
        )}
        {isListening && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'blue',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            🎤 Listening
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {!isRecording ? (
          <button
            onClick={startRecording}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Stop Recording
          </button>
        )}

        {videoBlob && (
          <button
            onClick={resetRecording}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        )}
      </div>

      {videoBlob && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            Recording completed! Transcription captured.
          </p>
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#666', maxWidth: '400px', textAlign: 'center' }}>
        {isListening ?
          "🎤 Speech recognition is active - your speech is being transcribed automatically" :
          "Speech recognition will start when you begin recording"
        }
      </div>
      <div style={{
  marginTop: '20px',
  maxWidth: '400px',
  textAlign: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '10px',
  padding: '10px',
  border: '1px solid #ccc'
}}>
  <strong>Transcript:</strong>
  <p style={{ color: '#333', fontSize: '14px' }}>
    {transcription || "🎙️ No speech detected yet... start speaking after hitting record!"}
  </p>
</div>
    </div>
  );
}

export default VideoQuestion;