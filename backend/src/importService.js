import { createClient } from '@supabase/supabase-js'
import * as xlsx from 'xlsx'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper para convertir fechas de Excel a YYYY-MM-DD
function parseExcelDate(excelDate) {
  if (!excelDate) return null
  if (typeof excelDate === 'number') {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000))
    return date.toISOString().split('T')[0]
  }
  return String(excelDate).trim()
}

const getOrCreateAttributeId = async (table, name) => {
  if (!name) return null
  const cleanName = String(name).trim()
  
  const { data } = await supabaseAdmin
    .from(table)
    .select('id')
    .ilike('name', cleanName)
    .maybeSingle()
    
  if (data) return data.id

  const { data: newData } = await supabaseAdmin
    .from(table)
    .insert([{ name: cleanName }])
    .select()
    .single()
    
  return newData?.id || null
}

export const processInventoryImport = async (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(sheet)
  
  const results = { success: 0, errors: [] }

  for (const [index, row] of rows.entries()) {
    try {
      const category_id = await getOrCreateAttributeId('categories', row.Categoria)
      const brand_id = await getOrCreateAttributeId('brands', row.Marca)
      const unit_id = await getOrCreateAttributeId('units', row.Unidad)

      const { error } = await supabaseAdmin.from('inventory').insert([{
        code: row.Codigo ? String(row.Codigo) : null,
        name: row.Nombre,
        category_id,
        brand_id,
        unit_id,
        stock: Number(row.Stock) || 0,
        min_stock: Number(row.StockMinimo) || 0,
        unit_price: Number(row.Precio) || 0
      }])

      if (error) throw error
      results.success++
    } catch (error) {
      results.errors.push(`Fila ${index + 2} (${row.Nombre || 'Sin nombre'}): ${error.message}`)
    }
  }
  return results
}

export const processPatientsImport = async (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(sheet)
  
  const results = { success: 0, errors: [] }
  const patientsToInsert = []

  for (const [index, row] of rows.entries()) {
    try {
      patientsToInsert.push({
        full_name: row.Nombre,
        birth_date: parseExcelDate(row.FechaNacimiento),
        sex: row.Sexo || 'Prefiere no indicar',
        phone: String(row.Telefono || ''),
        email: row.Correo ? String(row.Correo).toLowerCase() : null,
        address: row.Direccion || null
      })
    } catch (err) {
      results.errors.push(`Fila ${index + 2}: Error leyendo datos.`)
    }
  }

  // Inserción masiva
  if (patientsToInsert.length > 0) {
    const { error } = await supabaseAdmin.from('patients').insert(patientsToInsert)
    if (error) {
      results.errors.push(`Error al guardar en base de datos: ${error.message}`)
    } else {
      results.success = patientsToInsert.length
    }
  }

  return results
}