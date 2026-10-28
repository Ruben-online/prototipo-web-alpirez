import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Plus, X } from 'lucide-react'

export default function CreateAttributeModal({ type, title, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // Abrir el modal previniendo que el formulario padre se active
  const handleOpen = (e) => {
    e.preventDefault()
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setName('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (!name.trim()) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from(type) 
        .insert([{ name: name.trim() }])

      if (error) {
        if (error.code === '23505') throw new Error(`Esta ${title.toLowerCase()} ya existe.`)
        throw error
      }

      handleClose()
      if (onSuccess) onSuccess() 
    } catch (err) {
      console.error(`Error creando ${type}:`, err.message)
      alert(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Permitir guardar al presionar Enter y cerrar con Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Evita que se envíe el formulario principal
      handleSave(e)
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <>
      <button 
        type="button"
        onClick={handleOpen}
        title={`Nueva ${title}`}
        className="flex items-center justify-center p-2.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all"
      >
        <Plus size={20} strokeWidth={2} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex justify-center items-center z-[9999] p-4">
          <div 
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm relative transform transition-all"
            onClick={(e) => e.stopPropagation()} 
          >
            <button
              onClick={handleClose}
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Agregar {title.toLowerCase()}
            </h3>
            
            {/* NOTA: Usamos <div> en lugar de <form> para evitar el conflicto de recarga */}
            <div onKeyDown={handleKeyDown}>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Nombre de la ${title.toLowerCase()}`}
                className="w-full border border-gray-200 px-4 py-2.5 mb-6 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || !name.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}