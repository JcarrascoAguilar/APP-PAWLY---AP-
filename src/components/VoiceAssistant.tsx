import React from 'react';
import { useConversation, ConversationProvider } from '@elevenlabs/react';
import { Mic, MicOff, MessageCircle, Send, Volume2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePets, type PetStatus, type Species } from '@/lib/petnova';

const AGENT_ID = 'agent_8101kzhqh94geh6bqm1pjvjp3c69';

type ChatMessage = { id: string; role: 'user' | 'agent'; text: string };

const clean = (v: unknown, fallback = '') =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, 200) : fallback;

const VoiceAssistantWidget = () => {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<'voice' | 'text' | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const listRef = React.useRef<HTMLDivElement>(null);
  const { addPet } = usePets();
  const addPetRef = React.useRef(addPet);
  addPetRef.current = addPet;

  const crearPublicacion = React.useCallback(
    (status: PetStatus, params: Record<string, unknown>) => {
      const name = clean(params.name ?? params.nombre);
      const district = clean(params.district ?? params.distrito);
      const phone = clean(params.phone ?? params.telefono);
      if (!name || !district || !phone) {
        return 'Faltan datos: necesito nombre de la mascota, distrito y teléfono de contacto.';
      }
      const whatsapp = clean(params.whatsapp, phone).replace(/\D/g, '');
      const speciesRaw = clean(params.species ?? params.especie, 'perro').toLowerCase();
      const species: Species =
        speciesRaw.includes('gat') ? 'gato' : speciesRaw.includes('perr') ? 'perro' : 'otro';
      const sizeRaw = clean(params.size ?? params.tamano ?? params.tamaño, 'mediano').toLowerCase();
      const size = sizeRaw.startsWith('peq')
        ? ('pequeño' as const)
        : sizeRaw.startsWith('gran')
          ? ('grande' as const)
          : ('mediano' as const);
      const sex = clean(params.sex ?? params.sexo, 'macho').toLowerCase().startsWith('h')
        ? ('hembra' as const)
        : ('macho' as const);

      addPetRef.current({
        name,
        species,
        breed: clean(params.breed ?? params.raza, 'Mestizo'),
        age: clean(params.age ?? params.edad, 'Sin especificar'),
        sex,
        size,
        color: clean(params.color, 'Sin especificar'),
        district,
        location: clean(params.location ?? params.ubicacion, district),
        date: clean(params.date ?? params.fecha, new Date().toISOString().slice(0, 10)),
        description: clean(params.description ?? params.descripcion, 'Publicación creada con Nova.'),
        status,
        photos: [],
        phone,
        whatsapp,
        owner: clean(params.owner ?? params.dueno, 'Usuario PAWLY'),
      });

      const label =
        status === 'perdido' ? 'perdida' : status === 'encontrado' ? 'encontrada' : 'en adopción';
      toast.success(`Nova publicó a ${name} (${label})`);
      return `Publicación creada para ${name} como mascota ${label} en ${district}.`;
    },
    [],
  );

  const conversation = useConversation({
    clientTools: {
      publicar_mascota_perdida: (params: Record<string, unknown>) =>
        crearPublicacion('perdido', params ?? {}),
      publicar_mascota_encontrada: (params: Record<string, unknown>) =>
        crearPublicacion('encontrado', params ?? {}),
      publicar_mascota_adopcion: (params: Record<string, unknown>) =>
        crearPublicacion('adopcion', params ?? {}),
    },
    onConnect: () => console.log('Nova conectada'),
    onDisconnect: () => {
      console.log('Nova desconectada');
      setMode(null);
    },
    onError: (error) => console.error('Error:', error),
    onMessage: (payload: { message: string; source: string }) => {
      if (!payload?.message) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${prev.length}`,
          role: payload.source === 'user' ? 'user' : 'agent',
          text: payload.message,
        },
      ]);
    },
  });


  const isConnected = conversation.status === 'connected';

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const start = async (next: 'voice' | 'text') => {
    if (busy) return;
    setBusy(true);
    try {
      if (isConnected) await conversation.endSession();
      if (next === 'voice') {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: next === 'voice' ? 'webrtc' : 'websocket',
        textOnly: next === 'text',
      } as Parameters<typeof conversation.startSession>[0]);
      setMode(next);
    } catch (error) {
      console.error('No se pudo iniciar la conversación:', error);
    } finally {
      setBusy(false);
    }
  };

  const stop = async () => {
    setBusy(true);
    try {
      await conversation.endSession();
    } finally {
      setBusy(false);
      setMode(null);
    }
  };

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    if (!isConnected || mode !== 'text') await start('text');
    conversation.sendUserMessage(text);
    setMessages((prev) => [...prev, { id: `${Date.now()}-me`, role: 'user', text }]);
    setInput('');
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-40 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between gap-2 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div className="min-w-0">
              <p className="text-sm font-bold">Nova</p>
              <p className="truncate text-[11px] opacity-90">
                {isConnected
                  ? mode === 'voice'
                    ? 'En llamada de voz'
                    : 'Chat activo'
                  : 'Escribe o habla con la asistente'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="rounded-full p-1 transition-colors hover:bg-white/15"
            >
              <X className="size-4" />
            </button>
          </div>

          <div ref={listRef} className="flex max-h-72 min-h-40 flex-col gap-2 overflow-y-auto p-3">
            {messages.length === 0 ? (
              <p className="m-auto max-w-[16rem] text-center text-xs text-muted-foreground">
                Pregúntale a Nova sobre mascotas perdidas, adopción o cómo publicar un reporte.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === 'user'
                      ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground'
                      : 'mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground'
                  }
                >
                  {m.text}
                </div>
              ))
            )}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje…"
              className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              aria-label="Enviar mensaje"
              disabled={busy || !input.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => (isConnected && mode === 'voice' ? stop() : start('voice'))}
              aria-label={mode === 'voice' ? 'Finalizar llamada' : 'Hablar con Nova'}
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white ${
                mode === 'voice' ? 'animate-pulse bg-accent' : 'bg-foreground'
              }`}
            >
              {mode === 'voice' ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-lg transition-all active:scale-95"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span>{open ? 'Cerrar' : 'Hablar con Nova'}</span>
        {conversation.isSpeaking && <Volume2 size={18} className="animate-bounce" />}
      </button>
    </>
  );
};

export const VoiceAssistant = () => (
  <ConversationProvider>
    <VoiceAssistantWidget />
  </ConversationProvider>
);
