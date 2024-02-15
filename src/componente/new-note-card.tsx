import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner'


interface NewnoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null


export function NewnoteCard({ onNoteCreated }: NewnoteCardProps){

   const [shoultdShowOnboarding, setShoultdShowOnboarding] = useState(true)

   const [content, setContent] = useState('')
   const [isRecording, setRecording] = useState(false)


   function handleStarEditor(){
    setShoultdShowOnboarding(false)
   }

   function handleContentChange(event : ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)

    if(event.target.value === ''){
      setShoultdShowOnboarding(true)
    }
   }

   function handleSaveNote(event: FormEvent){
    event.preventDefault()

    if (content === ''){
      return
    }

    onNoteCreated(content)

    setContent('')
    setShoultdShowOnboarding(true)

    toast.success('Nota salva com sucesso')
   }

   function handleStarRecording () {
  

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window
    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador nao suporta API de gravação de audio! :( ')

      return

    }

    setRecording(true)
    setShoultdShowOnboarding(false)


    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()


    speechRecognition.lang ='pt-BR'
    // grava ate eu pedir para parar
    speechRecognition.continuous = true

    // Se ele nao entender alguma palavra ele te da 1 alternativa 
    speechRecognition.maxAlternatives = 1

    // quero que ela traga o resultado enquanto eu estou falando mesmo antes de eu terminar de falar
    speechRecognition.interimResults = true

    // arrow funtion para retornar o resultado sempre que ela ouvir algo
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)


        
      }, '')

      setContent(transcription)
    }

    //  verifica se a erro
    speechRecognition.onerror = (event) => {
      console.error(event)
    }
    
    // !!!!! IMPORTANTE SENAO NAO INICIA A GRAVAÇÃO
    speechRecognition.start()

   }

   function handleStopRecording() {
    setRecording(false)

    if(speechRecognition !== null){
      speechRecognition.stop()
    }

   }




    return(
      <Dialog.Root>
        <Dialog.Trigger className="rounded-md flex flex-col text-left  bg-slate-700 p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
          <span className="text-sm font-medium text-slate-200">
            Adicionar nota
          </span>
          <p className="text-sm leading- text-slate-400">
            Grave uma nota em áudio que será convertida para texto automaticamente.
          </p>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='inset-0  fixed bg-black/50'/>
          <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] h-[60vh] w-full bg-slate-700 rounded-md flex flex-col outline-none'>

            <Dialog.Close className='absolute top-0 right-0 text-slate-400 bg-slate-800 p-1.5 hover:text-slate-100'>
              <X className='size-5'/>
            </Dialog.Close>

            <form  className='flex flex-1 flex-col'>

              <div className='flex flex-1 gap-3 flex-col p-5  '>
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>

                {shoultdShowOnboarding ? (
                    <p className="text-sm leading-6 text-slate-400">
                    Comece <button type='button' onClick={handleStarRecording}  className='text-lime-400 hover:underline'>gravando uma nota</button > em áudio ou se preferir <button type='button' onClick={handleStarEditor} className='text-lime-400 hover:underline'>utilize apenas texto</button>.
                  </p>
                ): (
                    <textarea 
                    autoFocus
                    className='text-sm leading-6 bg-slate-700 bg-transparent resize-none flex-1 outline-none'
                    onChange={handleContentChange}
                    value={content}
                    />
                    
                )}
              </div>

                {isRecording ? (
                  <button type='button' onClick={handleStopRecording} className='w-full flex itens-center justify-center gap-2 bg-slate-900 py-4 text-sm text-center  text-slate-300 font-bold outline-none hover:bg-lime-500'>

                    <div className='size-3 rounded-full bg-red-500  animate-pulse ' />

                   Gravando! (clique para interromper)
                  </button>
                ) : (
                  <button type='button' onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-sm text-center  text-lime-950 font-bold outline-none hover:bg-lime-500'>
                    Salvar nota
                  </button>
                )}

             
            </form>

          </Dialog.Content>
        </Dialog.Portal>

      </Dialog.Root>
    )
}