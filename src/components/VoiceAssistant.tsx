import React from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export const VoiceAssistant = () => {
  const conversation = useConversation({
    onConnect: () => console.log('Nova conectada'),
    onDisconnect: () => console.log('Nova desconectada'),
    onError: (error) => console.error('Error:', error),
  });

  const toggleConversation = async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession();
    } else {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: 'agent_8101kzhqh94geh6bqm1pjvjp3c69',
        connectionType: 'webrtc',
      });
    }
  };

  const isConnected = conversation.status === 'connected';

  return (
    <button
      onClick={toggleConversation}
      className={`fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white shadow-lg transition-all active:scale-95 ${
        isConnected ? 'bg-[#F26B6B] animate-pulse' : 'bg-[#163A70] hover:bg-[#102a52]'
      }`}
    >
      {isConnected ? <MicOff size={20} /> : <Mic size={20} />}
      <span>{isConnected ? 'Finalizar llamada' : 'Hablar con Nova'}</span>
      {conversation.isSpeaking && <Volume2 size={18} className="animate-bounce" />}
    </button>
  );
};
