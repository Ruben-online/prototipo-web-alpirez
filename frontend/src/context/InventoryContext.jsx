import { useState, useEffect, useCallback } from 'react'
import { InventoryContext } from './inventoryContext'
import { supabase } from '../supabase'

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [units, setUnits] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // =======================================
  // FETCH DE CATÁLOGOS AUXILIARES
  // =======================================
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase.from('brands').select('*').order('name')
      if (error) throw error
      setBrands(data)
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  const fetchUnits = async () => {
    try {
      const { data, error } = await supabase.from('units').select('*').order('name')
      if (error) throw error
      setUnits(data)
    } catch (err) {
      console.error('Error fetching units:', err)
    }
  }

  // =======================================
  // FETCH DE INVENTARIO PRINCIPAL
  // =======================================
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          categories ( id, name ),
          brands ( id, name ),
          units ( id, name )
        `)
        .order('name', { ascending: true })

      if (error) throw error

      const mappedData = data.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        description: item.description,
        categoryId: item.category_id,
        categoryName: item.categories?.name || 'Sin categoría',
        brandId: item.brand_id,
        brandName: item.brands?.name || 'Sin marca',
        unitId: item.unit_id,
        unitName: item.units?.name || 'Sin unidad',
        stock: item.stock,
        minStock: item.min_stock,
        unitPrice: item.unit_price,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }))

      setItems(mappedData)
    } catch (err) {
      console.error('Error fetching inventory:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // =======================================
  // CARGAR TODO AL INICIO
  // =======================================
  const fetchAllData = useCallback(async () => {
    await Promise.all([fetchCategories(), fetchBrands(), fetchUnits(), fetchInventory()])
  }, [fetchInventory])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // =======================================
  // CRUD INVENTARIO
  // =======================================
  const addItem = async (newItem) => {
    try {
      const category_id = newItem.categoryId ? Number(newItem.categoryId) : null;
      const brand_id = newItem.brandId ? Number(newItem.brandId) : null;
      const unit_id = newItem.unitId ? Number(newItem.unitId) : null;

      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          code: newItem.code || null,
          name: newItem.name,
          description: newItem.description || '',
          category_id,
          brand_id,
          unit_id,
          stock: Number(newItem.stock) || 0,
          min_stock: Number(newItem.minStock) || 0,
          unit_price: Number(newItem.unitPrice) || 0
        }])
        .select()

      if (error) throw error
      await fetchInventory()
      return data[0]
    } catch (err) {
      console.error('Error adding item:', err)
      throw err
    }
  }

  const updateItem = async (id, updatedData) => {
    try {
      const category_id = updatedData.categoryId ? Number(updatedData.categoryId) : null;
      const brand_id = updatedData.brandId ? Number(updatedData.brandId) : null;
      const unit_id = updatedData.unitId ? Number(updatedData.unitId) : null;

      const { error } = await supabase
        .from('inventory')
        .update({
          code: updatedData.code || null,
          name: updatedData.name,
          description: updatedData.description || '',
          category_id,
          brand_id,
          unit_id,
          stock: Number(updatedData.stock) || 0,
          min_stock: Number(updatedData.minStock) || 0,
          unit_price: Number(updatedData.unitPrice) || 0
        })
        .eq('id', id)

      if (error) throw error
      await fetchInventory()
    } catch (err) {
      console.error('Error updating item:', err)
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchInventory()
    } catch (err) {
      console.error('Error deleting item:', err)
      throw err
    }
  }

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        brands,
        units, // ¡IMPORTANTE! Agregado para que el modal lo lea
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        refreshInventory: fetchInventory,
        refreshCategories: fetchCategories,
        refreshBrands: fetchBrands,
        refreshUnits: fetchUnits // ¡IMPORTANTE! Agregado para que el modal refresque las unidades
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}