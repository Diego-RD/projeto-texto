import { ChangeEvent, useState } from 'react'
import logo from './assets/Logo.svg'
import { NewnoteCard } from './componente/new-note-card'
import { Newcard } from './componente/note-card'


interface Note {
  id: string,
  date: Date,
  content: string
}


export function App() {

  const [search, setSearch] = useState('')


  const [notes, setNotes] = useState<Note[]>(() =>{

    const notOnStorage = localStorage.getItem('notes')

    if (notOnStorage) {
      return JSON.parse(notOnStorage)
    }

    return []
  })


  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }
    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))

  }

  function onNoteDeleted(id: string){
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

      setNotes(notesArray)

      localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const pesquisa = event.target.value

    setSearch(pesquisa)

  }


  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes


  // JSON = Java Script Object Notation , o local storage nao aceita array entao usamos JSON.stringift para transformar

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
      <img  src={logo} alt='NLW logo'/>

      <form className="w-full" >
        <input 
          type="text" 
          placeholder='Busque suas notas...' 
          className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none  placeholder:text-slate-500" 
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]  ">
        
        <NewnoteCard onNoteCreated={onNoteCreated}  />
        
        {filteredNotes.map(note => {
          return <Newcard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}
      
     
      </div>

    </div>
  )
}

